/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';

type TCAhkSwitchParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
    ch: vscode.DocumentSymbol[];
};
// switch
export class CAhkSwitch extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Enum;
    declare public readonly detail: 'Switch';
    declare public readonly children: vscode.DocumentSymbol[];
    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            ch,
        }: TCAhkSwitchParam,
    ) {
        super(name, 'Switch', vscode.SymbolKind.Enum, range, selectionRange);
        this.uri = uri;
        this.children = ch;
    }
}

// ----

type TCAhkSwitchCaseParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
    ch: vscode.DocumentSymbol[];
};

export class CAhkCase extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.EnumMember;
    declare public readonly detail: 'Case';
    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            ch,
        }: TCAhkSwitchCaseParam,
    ) {
        super(name, 'Case', vscode.SymbolKind.EnumMember, range, selectionRange);
        this.uri = uri;
        this.children = ch;
    }
}

export class CAhkDefault extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.EnumMember;
    declare public readonly detail: 'Default';
    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            ch,
        }: TCAhkSwitchCaseParam,
    ) {
        super(name, 'Default', vscode.SymbolKind.EnumMember, range, selectionRange);
        this.uri = uri;
        this.children = ch;
    }
}
