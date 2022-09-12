import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { CDiagBase } from '../CDiagBase';

export function getObjBaseErr(params: TAhkTokenLine): CDiagBase | null {
    // base property
    // Prototype pollution!
    // .base
    const {
        lStr,
        line,
    } = params;

    const baseLen: number = 'x.base'.length;
    if (lStr.length < baseLen) return null;
    if (!lStr.includes('.')) return null;

    const colL: number = lStr.search(/\.base\b/ui);
    if (colL === -1) return null; // not find

    return new CDiagBase({
        value: EDiagCode.code601,
        range: new vscode.Range(line, colL, line, colL + baseLen), // ".base" or "base:" len
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    });
}
// TODO {base: GMem} https://www.autohotkey.com/docs/Objects.htm#Custom_Objects
