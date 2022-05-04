import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// https://www.autohotkey.com/docs/commands/_Include.htm
// ---------------------------------------------------------------------------

type TCAhkIncludeParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
};

export class CAhkInclude extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Module;
    declare public readonly detail: '';

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TCAhkIncludeParam,
    ) {
        super(name, '', vscode.SymbolKind.Module, range, selectionRange);
        this.uri = uri;
    }
}
// TODO  #Include
//           #Include FileOrDirName
//           #IncludeAgain FileOrDirName
//           \*i\s
//           #Include <LibName>  https://www.autohotkey.com/docs/Functions.htm#lib
//
//           A_AhkPath, A_ComputerName, A_ComSpec, A_Desktop, A_DesktopCommon, A_IsCompiled
//           A_MyDocuments, A_ProgramFiles, A_Programs, A_ProgramsCommon
//           A_ScriptFullPath, A_ScriptName, A_StartMenu,A_StartMenuCommon
//           A_Startup,A_StartupCommon, A_Temp, A_UserName ,A_WinDir
//           A_UserName, A_WinDir
