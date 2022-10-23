import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { EDetail } from '../../../../globalEnum';
import { CDiagBase } from '../CDiagBase';

export function assignErr({
    detail,
    line,
    lStr,
}: TAhkTokenLine): CDiagBase | null {
    return detail.includes(EDetail.inSkipSign2)
        ? new CDiagBase({
            value: EDiagCode.code107,
            range: new vscode.Range(line, lStr.search(/\S/u), line, lStr.indexOf('=')),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        })
        : null; // 0
}
