import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { DetailType } from '../../../../globalEnum';
import { EDiagLine, TLineDiag } from './lineErrTools';

export function assignErr(textRaw: string, detail: readonly DetailType[]): TLineDiag {
    // https://www.autohotkey.com/docs/commands/SetEnv.htm
    if (!detail.includes(DetailType.inSkipSign2)) return EDiagLine.miss;

    const colL = textRaw.indexOf('=');
    return {
        colL,
        colR: textRaw.length,
        value: EDiagCode.code107,
        severity: vscode.DiagnosticSeverity.Error,
        tags: [],
    };
}
