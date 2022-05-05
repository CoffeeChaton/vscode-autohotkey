import * as vscode from 'vscode';

type TCAhkCommentParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
};

export class CAhkComment extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Package;
    declare public readonly detail: '';

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TCAhkCommentParam,
    ) {
        super(name, '', vscode.SymbolKind.Package, range, selectionRange);
        this.uri = uri;
    }
}
