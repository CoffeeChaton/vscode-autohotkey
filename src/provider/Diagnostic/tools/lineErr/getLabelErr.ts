import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { EDiagLine, TLineDiag } from './lineErrTools';

export function getLabelErr(lStr: string, lStrTrim: string): TLineDiag {
    if (lStrTrim.indexOf(':') < 1) return EDiagLine.miss;

    const exec = (/^(\w+)\s*:/u).exec(lStrTrim);
    if (exec === null) return EDiagLine.miss;

    const labName = exec[1];
    type TLabelErr = {
        reg: RegExp;
        code: EDiagCode;
    };
    const headMatch: TLabelErr[] = [
        {
            reg: /^OnClipboardChange$/ui,
            code: EDiagCode.code811,
        },
        {
            reg: /^OnExit$/ui,
            code: EDiagCode.code812,
        },
    ];
    for (const v of headMatch) {
        if (v.reg.test(labName)) {
            const colL = lStr.search(labName);
            return {
                colL,
                colR: colL + labName.length,
                value: v.code,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [vscode.DiagnosticTag.Deprecated],
            };
        }
    }

    return EDiagLine.OK;
}
