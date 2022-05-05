import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// https://www.autohotkey.com/docs/misc/Labels.htm
// ---------------------------------------------------------------------------

type TCAhkLabelParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
};

export class CAhkLabel extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Namespace;
    declare public readonly detail: 'label';

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TCAhkLabelParam,
    ) {
        super(name, 'label', vscode.SymbolKind.Namespace, range, selectionRange);
        this.uri = uri;
    }
}

// Label names must be unique throughout the whole script.
// not be used: On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.
