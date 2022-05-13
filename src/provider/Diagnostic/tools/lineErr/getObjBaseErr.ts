import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { CNekoBaseLineDiag, EDiagLine, TLineErrDiagParam } from './lineErrTools';

export function getObjBaseErr(params: TLineErrDiagParam): CNekoBaseLineDiag | EDiagLine.miss {
    // base property
    // Prototype pollution!
    // .base
    const {
        lStr,
        lStrTrim,
        line,
    } = params;

    const baseLen: number = 'x.base'.length;
    if (lStrTrim.length < baseLen) return EDiagLine.miss;
    if (lStrTrim.indexOf('.') === -1) return EDiagLine.miss;

    const colL = lStr.search(/\.base\b/ui);
    if (colL === -1) { // not find
        return EDiagLine.miss;
    }

    return new CNekoBaseLineDiag({
        line,
        colL,
        colR: colL + baseLen, // ".base" or "base:" len
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
        value: EDiagCode.code601,
    });
}
