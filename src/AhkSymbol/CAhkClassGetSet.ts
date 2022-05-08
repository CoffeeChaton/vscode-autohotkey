import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// https://www.autohotkey.com/docs/Objects.htm#Custom_Classes_property
// ---------------------------------------------------------------------------

type TCAhkClassGetSetParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
};

export class CAhkClassGetSet extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Property;
    declare public readonly detail: 'Property';
    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TCAhkClassGetSetParam,
    ) {
        super(name, 'Property', vscode.SymbolKind.Property, range, selectionRange);
        this.uri = uri;
    }
}

// Label names must be unique throughout the whole script.
// not be used: On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.
