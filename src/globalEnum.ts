/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';
/* eslint-disable @typescript-eslint/no-type-alias */
export const enum EMode {
    ahkVoid = 'void',
    ahkFunc = 'Function',
    ahkClass = 'Class',
    ahkMethod = 'Method',
    ahkAll = 'ahkAll',
    ahkGlobal = 'global'
}
// vscode.SymbolKind
// enum SymbolKind {
//     Class = 4,
//     Method = 5,
//     Function = 11,
//     Variable = 12,
// }

export const enum EStr {
    diff_name_prefix = '_diff_temp_'
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export const enum DetailType {
    inComment = 'c',
    inLTrim0 = 0,
    inLTrim1 = 1,
    // eslint-disable-next-line no-magic-numbers
    inLTrim2 = 2,
    inSkipSign = 'Sk',
    deepAdd = '+',
    deepSubtract = '-',
}

// textRaw
type Val = { lStr: string, textRaw: string, deep: number, detail: DetailType[] };
export type TDocArrRaw = DeepReadonly<Val>[];
export type TDocArr = DeepReadonly<TDocArrRaw>;
export type MyDocSymbol = DeepReadonly<vscode.DocumentSymbol>;
export type MyDocSymbolArr = DeepReadonly<vscode.DocumentSymbol[]>;

export const enum VERSION {
    Parser = 'v0.6, ',
    getValDefInFunc = '0.4beta',
    format = 'v0.48',
    formatRange = ' v0.4a',
}
export const enum EDiagnostic {
    ParserIgnore = ';@ahk-ignore ', // ;@ahk-ignore 30 line.
    Source = 'neko help',
    code107 = 107,
    code107assignWarning = 'assign warning',
    code110 = 110,
    code110swNotFindDefault = 'default : not find ',
    code111 = 111,
    code111swDefaultTooMuch = 'default : too much ',
    code112 = 112,
    code112swCaseTooMuch = 'Case : > 20',
    code113 = 113,
    code113swCaseIsZero = 'Case : not find ',
}
