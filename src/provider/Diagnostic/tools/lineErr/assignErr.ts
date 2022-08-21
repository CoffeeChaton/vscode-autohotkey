import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { EDetail } from '../../../../globalEnum';
import { CDiagBase } from '../CDiagBase';

export function assignErr({ textRaw, detail, line }: TAhkTokenLine): CDiagBase | null {
    return detail.includes(EDetail.inSkipSign2)
        ? new CDiagBase({
            value: EDiagCode.code107,
            range: new vscode.Range(line, textRaw.indexOf('='), line, textRaw.length),
            severity: vscode.DiagnosticSeverity.Error,
            tags: [],
        })
        : null; // 0
}
