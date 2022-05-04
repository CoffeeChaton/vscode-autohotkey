import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// https://www.autohotkey.com/docs/misc/Labels.htm
// ---------------------------------------------------------------------------

type TCAhkHotStringParam = {
    name: string;
    range: vscode.Range;
    selectionRange: vscode.Range;
    uri: vscode.Uri;
};

export class CAhkHotString extends vscode.DocumentSymbol {
    public readonly uri: vscode.Uri;

    declare public readonly kind: vscode.SymbolKind.Event;
    declare public readonly detail: 'HotString';

    public constructor(
        {
            name,
            range,
            selectionRange,
            uri,
        }: TCAhkHotStringParam,
    ) {
        super(name, 'HotString', vscode.SymbolKind.Event, range, selectionRange);
        this.uri = uri;
    }
}

// Label names must be unique throughout the whole script.
// not be used: On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.
