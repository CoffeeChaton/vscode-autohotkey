/* eslint no-magic-numbers: ["error", { "ignore": [4,5,11,12] }] */
import * as vscode from 'vscode';
import { EMode } from '../../globalEnum';
// const enum EMode {
//     ahkFunc = 'Function',
//     ahkClass = 'Class',
//     ahkMethod = 'Method',
// }
// enum ESymbolKind {
//     Class = 4,
//     Method = 5,
//     Function = 11,
//     Variable = 12,
// }
export function kindCheck(mode: EMode, kind: vscode.SymbolKind): boolean {
    switch (mode) {
        case EMode.ahkClass:
            return kind === vscode.SymbolKind.Class;
        case EMode.ahkMethod:
            return kind === vscode.SymbolKind.Method;
        case EMode.ahkFunc:
            return kind === vscode.SymbolKind.Function;
        case EMode.ahkGlobal:
            return kind === vscode.SymbolKind.Variable;
        default:
            return false;
    }
}
