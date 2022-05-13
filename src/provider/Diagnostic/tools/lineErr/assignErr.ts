import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { EDetail } from '../../../../globalEnum';
import { CNekoBaseLineDiag } from './lineErrTools';

export function assignErr(textRaw: string, detail: readonly EDetail[], line: number): null | CNekoBaseLineDiag {
    return detail.includes(EDetail.inSkipSign2)
        ? new CNekoBaseLineDiag({
            line,
            colL: textRaw.indexOf('='),
            colR: textRaw.length,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [],
            value: EDiagCode.code107,
        })
        : null; // 0
}
