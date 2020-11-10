/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';

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
export type TSymAndFsPath = { ahkSymbol: MyDocSymbol; fsPath: string; };

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
    code110 = 110, // 100~110 is switch err
    code111 = 111,
    code112 = 112,
    code113 = 113,
    code201 = 201, // 200~299 is not expression // need use %
    code801 = 801, // 800~899 is Deprecated / Old Syntax
    code802 = 802,
    code901 = 901, // 901~999 is not recommended
    code902 = 902,
    code903 = 903,
}
export const enum EDiagMsg {
    code107 = 'assign warning',
    code110 = 'default : not find ',
    code111 = 'default : too much ',
    code112 = 'Case : > 20',
    code113 = 'Case : not find ',
    code201 = 'Count cannot be an expression, use %',
    code801 = 'Old Syntax',
    code802 = 'Old Syntax',
    code901 = 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work for this.',
    code902 = 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work for this.',
    code903 = 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work for this.',
}
export const enum EDiagFsPath {
    code107 = 'https://www.autohotkey.com/docs/commands/SetEnv.htm',
    code110 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code111 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code112 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code113 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code201 = 'https://www.autohotkey.com/docs/commands/Loop.htm',
    code801 = 'https://www.autohotkey.com/docs/commands/LoopReg.htm#old',
    code802 = 'https://www.autohotkey.com/docs/commands/LoopFile.htm#old',
    code901 = 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm',
    code902 = 'https://www.autohotkey.com/docs/commands/_CommentFlag.htm',
    code903 = 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related',
}
