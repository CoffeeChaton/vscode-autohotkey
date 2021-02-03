import * as path from 'path';
import * as vscode from 'vscode';

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
    const includeExec = (/^\s*#include(?:again)?\s*(?:\*i )?\s*(\S\S*\.ahk)\s*$/i).exec(document.lineAt(position).text);
    if (includeExec === null) return false; //               includeExec[1]

    const length = Math.max(document.uri.path.lastIndexOf('/'), document.uri.path.lastIndexOf('\\'));
    if (length <= 0) return false;
    const lPath = path.dirname(document.uri.fsPath);
    const rPath = includeExec[1].replace(/%A_Space%/g, ' ').replace(/%A_Tab%/g, '\t');
    if ((/%A_\w\w*%/).test(rPath)) {
        console.log('ahkInclude ~ neko-help not support of %A_ScriptDir% or Similar syntax');
        return false;
    }
    const pathFix = `${lPath}\\${rPath}`;
    // console.log('ahkInclude -> pathFix', pathFix);
    const uri = vscode.Uri.file(pathFix);
    return new vscode.Location(uri, new vscode.Position(0, 0));
}
