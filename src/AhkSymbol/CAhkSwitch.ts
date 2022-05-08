/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';
import { ParserLine } from '../core/ParserTools/ParserLine';

type TCAhkSwitchParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
    ch: (CAhkCase | CAhkDefault)[];
};
// switch
export class CAhkSwitch extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Enum;
    declare public readonly detail: 'Switch';
    declare public readonly children: (CAhkCase | CAhkDefault)[];
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
// case | default
type T1 = ReturnType<typeof ParserLine>;

export type TCaseCh = Exclude<CAhkSwitch | T1, null>;

type TCAhkSwitchCaseParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
    ch: TCaseCh[];
};

export class CAhkCase extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.EnumMember;
    declare public readonly detail: 'Case';
    declare public readonly children: TCaseCh[];
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
    declare public readonly children: TCaseCh[];
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
