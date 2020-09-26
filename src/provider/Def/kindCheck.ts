/* eslint no-magic-numbers: ["error", { "ignore": [4,5,11,12] }] */
import * as vscode from 'vscode';
import { EMode } from '../../globalEnum';
// const enum EMode {
//     ahkFunc = 'Function',
//     ahkClass = 'Class',
//     ahkMethod = 'Method',
// }
// enum SymbolKind {
//     Class = 4,
//     Method = 5,
//     Function = 11,
//     Variable = 12,
// }
export function kindCheck(mode: EMode, kind: vscode.SymbolKind): boolean {
    switch (mode) {
        case 'Class':
            return kind === 4;
        case 'Method':
            return kind === 5;
        case 'Function':
            return kind === 11;
        case 'global':
            return kind === 12;
        default:
            return false;
    }
}
