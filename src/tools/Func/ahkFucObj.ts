/* eslint-disable no-magic-numbers */

import * as vscode from 'vscode';

export const enum EFnMode {
    normal = 1,
    local = 2,
    global = 3,
    Static = 4,
}

type TArgs = readonly {
    readonly BySelf: boolean,
    readonly name: string,
    readonly defaultValue: string, // :=
    readonly LineComment: string,
}[];

type TValue = readonly {
    readonly name: string,
    readonly pos: vscode.Position,
    readonly TextRaw: string,
    readonly TextRawFix: string,
}[];

export type MyFuncSymbol = {
    args: TArgs;
    argsRange: vscode.Range; // exp: (a,b, BySelf c, d := "999")
    mode: EFnMode,
    value: TValue,
    selectionRangeTextRaw: string,
    funcComment: vscode.MarkdownString | null,
} & vscode.DocumentSymbol;
// TODO wm
