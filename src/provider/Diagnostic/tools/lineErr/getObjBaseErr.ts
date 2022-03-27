import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { EDiagLine, TLineDiag } from './lineErrTools';

export function getObjBaseErr(lStr: string, _lStrTrim: string, _fistWord: string): TLineDiag {
    // base property
    // Prototype pollution!
    // .base
    const colL = lStr.search(/\.base\b/ui);
    if (colL === -1) { // not find
        return EDiagLine.miss;
    }

    return {
        colL,
        // eslint-disable-next-line no-magic-numbers
        colR: colL + 5, // ".base" or "base:" len
        value: EDiagCode.code601,
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    };
}
