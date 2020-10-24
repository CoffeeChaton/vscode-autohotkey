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
    inSkipSign2 = 'Sk2',
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
export const enum EDiagBase {
    ignore = ';@ahk-ignore ', // ;@ahk-ignore 30 line.
    source = 'neko help',
}
export const enum EDiagCode {
    code107 = 107,
    code110 = 110,
    code111 = 111,
    code112 = 112,
    code113 = 113,
}
export const enum EDiagMsg {
    code107 = 'assign warning',
    code110 = 'default : not find ',
    code111 = 'default : too much ',
    code112 = 'Case : > 20',
    code113 = 'Case : not find ',
}
export const enum EDiagFsPath {
    code107 = 'https://www.autohotkey.com/docs/commands/SetEnv.htm',
    code110 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code111 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code112 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code113 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
}
