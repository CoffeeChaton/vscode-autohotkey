import * as vscode from 'vscode';

type TCAhkSwitchParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
    ch: [];
};

export class CAhkSwitch extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Enum;
    declare public readonly detail: 'Switch';

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TCAhkSwitchParam,
    ) {
        super(name, 'Switch', vscode.SymbolKind.Enum, range, selectionRange);
        this.uri = uri;
    }
}
