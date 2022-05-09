/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';

export class CAhkHotKeys extends vscode.DocumentSymbol {
    // // https://www.autohotkey.com/docs/misc/Labels.htm
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: 'HotKeys';
    declare public readonly children: [];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: {
            name: string;
            range: vscode.Range;
            selectionRange: vscode.Range;
            uri: vscode.Uri;
        },
    ) {
        super(name, 'HotKeys', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
    }
}

export class CAhkHotString extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: 'HotString';
    declare public readonly children: [];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: {
            name: string;
            range: vscode.Range;
            selectionRange: vscode.Range;
            uri: vscode.Uri;
        },
    ) {
        super(name, 'HotString', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
    }
}

export class CAhkInclude extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/commands/_Include.htm
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

    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Module;
    declare public readonly detail: '';
    declare public readonly children: [];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: {
            name: string;
            range: vscode.Range;
            selectionRange: vscode.Range;
            uri: vscode.Uri;
        },
    ) {
        super(name, '', vscode.SymbolKind.Module, range, selectionRange);
        this.uri = uri;
    }
}

export class CAhkLabel extends vscode.DocumentSymbol {
    // https://www.autohotkey.com/docs/misc/Labels.htm
    // Label names must be unique throughout the whole script.
    // not be used: On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Namespace;
    declare public readonly detail: 'label';
    declare public readonly children: [];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: {
            name: string;
            range: vscode.Range;
            selectionRange: vscode.Range;
            uri: vscode.Uri;
        },
    ) {
        super(name, 'label', vscode.SymbolKind.Namespace, range, selectionRange);
        this.uri = uri;
    }
}

export class CAhkComment extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Package;
    declare public readonly detail: '';
    declare public readonly children: [];
    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: {
            name: string;
            range: vscode.Range;
            selectionRange: vscode.Range;
            uri: vscode.Uri;
        },
    ) {
        super(name, '', vscode.SymbolKind.Package, range, selectionRange);
        this.uri = uri;
    }
}

export type TLineClass =
    | CAhkComment
    | CAhkHotKeys
    | CAhkHotString
    | CAhkInclude
    | CAhkLabel;
