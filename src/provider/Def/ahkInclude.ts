import * as vscode from 'vscode';
/* eslint no-magic-numbers: ["error", { "ignore": [0,1] }] */
//   OK      #Include FileOrDirName
//           #IncludeAgain FileOrDirName
//           \*i\s
// TODO     #Include <LibName>  https://www.autohotkey.com/docs/Functions.htm#lib

// Will not support
//              A_AhkPath, A_ComputerName, A_ComSpec, A_Desktop, A_DesktopCommon, A_IsCompiled
//              A_MyDocuments, A_ProgramFiles, A_Programs, A_ProgramsCommon
//              A_ScriptFullPath, A_ScriptName, A_StartMenu,A_StartMenuCommon
//              A_Startup,A_StartupCommon, A_Temp, A_UserName ,A_WinDir
//              A_UserName, A_WinDir

export function ahkInclude(document: vscode.TextDocument, position: vscode.Position): false | vscode.Location {
    // at #include line
    const includeExec = (/^#include(?:again)?\s*(?:\*i )?\s*(\S\S*\.ahk)$/i).exec(document.lineAt(position).text.trim());
    if (includeExec === null) return false;

    const length = Math.max(document.uri.path.lastIndexOf('/'), document.uri.path.lastIndexOf('\\'));
    if (length <= 0) return false;
    const parent = document.uri.path.substr(0, length);
    const fsPath = includeExec[1].replace(/%A_Space%/, ' ').replace(/%A_Tab%/, '\t');
    const fsPathFix = (/(%A_ScriptDir%)|(%A_WorkingDir%)|(%A_LineFile%)/).test(fsPath)
        ? includeExec[1].replace(/(%A_ScriptDir%)|(%A_WorkingDir%)|(%A_LineFile%)/, parent)
        : `${parent}\\${fsPath}`;
    const uri = vscode.Uri.file(fsPathFix);
    return new vscode.Location(uri, new vscode.Position(0, 0));
}
