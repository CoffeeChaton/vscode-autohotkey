/* eslint-disable max-classes-per-file */
import * as vscode from 'vscode';
import { TLineClass } from './CAhkLine';

// switch
export class CAhkSwitch extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Enum;
    declare public readonly detail: 'Switch';
    declare public readonly children: (CAhkDefault | CAhkCase)[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            ch,
        }: {
            name: string;
            range: vscode.Range;
            selectionRange: vscode.Range;
            uri: vscode.Uri;
            ch: (CAhkDefault | CAhkCase)[];
        },
    ) {
        super(name, 'Switch', vscode.SymbolKind.Enum, range, selectionRange);
        this.uri = uri;
        this.children = ch;
    }
}

export class CAhkCase extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.EnumMember;
    declare public readonly detail: 'Case';
    declare public readonly children: (TLineClass | CAhkSwitch)[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            ch,
        }: {
            name: string;
            range: vscode.Range;
            selectionRange: vscode.Range;
            uri: vscode.Uri;
            ch: (TLineClass | CAhkSwitch)[];
        },
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
    declare public readonly children: (TLineClass | CAhkSwitch)[];

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
            ch,
        }: {
            name: string;
            range: vscode.Range;
            selectionRange: vscode.Range;
            uri: vscode.Uri;
            ch: (TLineClass | CAhkSwitch)[];
        },
    ) {
        super(name, 'Default', vscode.SymbolKind.EnumMember, range, selectionRange);
        this.uri = uri;
        this.children = ch;
    }
}
