import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';

export const enum EDiagLine {
    miss = 0,
    OK = 1,
}
export type TLineErr = {
    colL: number;
    colR: number;
    value: EDiagCode;
    severity: vscode.DiagnosticSeverity;
    tags: vscode.DiagnosticTag[];
};
export type TLineDiag = EDiagLine | TLineErr;

// return {
//     colL,
//     colR,
//     value,
//     severity,
//     tags,
// };
