import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine, TTokenStream } from '../../../../globalEnum';
import { EDetail, EMultiline } from '../../../../globalEnum';

import { CDiagBase } from '../CDiagBase';

export function assignErr({
    detail,
    line,
    lStr,
}: TAhkTokenLine, DocStrMap: TTokenStream): CDiagBase | null {
    if (!detail.includes(EDetail.inSkipSign2)) return null;

    const tokenNext: TAhkTokenLine | undefined = DocStrMap[line + 1] as TAhkTokenLine | undefined;

    if (tokenNext !== undefined && tokenNext.multiline === EMultiline.start) {
        return null;
    }

    return new CDiagBase({
        value: EDiagCode.code107,
        range: new vscode.Range(line, lStr.search(/\S/u), line, lStr.indexOf('=')),
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    });
}
