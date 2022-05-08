import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// https://www.autohotkey.com/docs/Objects.htm#Custom_Classes_var
// ---------------------------------------------------------------------------

type TCAhkClassInstanceVarParam = {
    showName: string;
    realName: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
    detail: 'Instance Var' | 'static ClassVar';
    isStatic: boolean;
};

export class CAhkClassInstanceVar extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;
    public readonly realName: string;
    public readonly isStatic: boolean;
    declare public readonly kind: vscode.SymbolKind.Variable;
    declare public readonly detail: 'Instance Var' | 'static ClassVar';
    public constructor(
        {
            showName,
            range,
            selectionRange,
            uri,
            detail,
            realName,
            isStatic,
        }: TCAhkClassInstanceVarParam,
    ) {
        super(showName, detail, vscode.SymbolKind.Variable, range, selectionRange);
        this.uri = uri;
        this.realName = realName;
        this.isStatic = isStatic;
    }
}
