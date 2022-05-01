import * as vscode from 'vscode';

// ---------------------------------------------------------------------------
// https://www.autohotkey.com/docs/Objects.htm#Custom_Classes
// ---------------------------------------------------------------------------
type TUpName = string;

type MyDocArg = {
    name: string;
    detail: string;
    kind: vscode.SymbolKind;
    range: vscode.Range;
    selectionRange: vscode.Range;
    //
    //  md: vscode.MarkdownString
    insertText: string;
    uri: vscode.Uri;
    children: vscode.DocumentSymbol[]; // ... CAhkFuncSymbol CAhkClassSymbol vscode.DocumentSymbol
};

// AH instanceof CAhkClass

export class CAhkClass extends vscode.DocumentSymbol {
    public readonly insertText: string;
    public readonly uri: vscode.Uri;
    public readonly upName: TUpName;
    declare public kind: vscode.SymbolKind.Class;
    declare public children: vscode.DocumentSymbol[];

    public constructor(
        {
            name,
            detail,
            kind,
            range,
            selectionRange,
            insertText,
            uri,
            children,
        }: MyDocArg,
    ) {
        super(name, detail, kind, range, selectionRange);
        this.insertText = insertText;
        this.upName = name.toUpperCase();
        this.uri = uri;
        this.children = children;
    }
}

// https://www.autohotkey.com/docs/Objects.htm#Custom_NewDelete

// m1 := new GMem(0, 20) ; OK!
// m2 := {base: GMem}.__New(0, 30) ; no support

// class GMem
// {
//     __New(aFlags, aSize)
//     {
//         this.ptr := DllCall("GlobalAlloc", "UInt", aFlags, "Ptr", aSize, "Ptr")
//         if !this.ptr
//             return ""
//         MsgBox % "New GMem of " aSize " bytes at address " this.ptr "."
//         return this  ; This line can be omitted when using the 'new' operator.
//     }

//     __Delete()
//     {
//         MsgBox % "Delete GMem at address " this.ptr "."
//         DllCall("GlobalFree", "Ptr", this.ptr)
//     }
// }

// ...Method syntax:

// class ClassName {
//     __Get([Key, Key2, ...])
//     __Set([Key, Key2, ...], Value)
//     __Call(Name [, Params...])
// }

// static init := ("".base.base := StringLib)
// static __Set := Func("StringLib_Set")
