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

// textRaw
type Val = { lStr: string, textRaw: string, deep: number };
export type TDocArrRaw = DeepReadonly<Val>[];
export type TDocArr = DeepReadonly<TDocArrRaw>;
export type MyDocSymbol = DeepReadonly<vscode.DocumentSymbol>;
export type MyDocSymbolArr = DeepReadonly<vscode.DocumentSymbol[]>;

export const enum VERSION {
    Parser = 'v0.6, ',
    getValDefInFunc = '0.3beta',
    format = 'v0.48',
    formatRange = ' v0.4a',
}
