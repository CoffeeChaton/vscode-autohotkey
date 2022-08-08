import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { CDiagBase } from '../CDiagBase';
import type { TLineErrDiagParam } from './lineErrTools';
import { EDiagLine } from './lineErrTools';

export function getObjBaseErr(params: TLineErrDiagParam): CDiagBase | EDiagLine.miss {
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
    if (!lStrTrim.includes('.')) return EDiagLine.miss;

    const colL = lStr.search(/\.base\b/ui);
    if (colL === -1) { // not find
        return EDiagLine.miss;
    }
    return new CDiagBase({
        value: EDiagCode.code601,
        range: new vscode.Range(line, colL, line, colL + baseLen), // ".base" or "base:" len
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    });
}
