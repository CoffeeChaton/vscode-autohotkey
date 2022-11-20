import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine, TTokenStream } from '../../../../globalEnum';
import { EDetail, EMultiline } from '../../../../globalEnum';
import { CDiagBase } from '../CDiagBase';

function assignErr({
    detail,
    line,
    lStr,
}: TAhkTokenLine, DocStrMap: TTokenStream): CDiagBase | null {
    if (!detail.includes(EDetail.inSkipSign2)) return null;

    const tokenNext: TAhkTokenLine | undefined = DocStrMap[line + 1] as TAhkTokenLine | undefined;

    if (tokenNext !== undefined && tokenNext.multiline === EMultiline.start) {
        return null;
    }

    const col: number = lStr.indexOf('=');
    return new CDiagBase({
        value: EDiagCode.code107,
        range: new vscode.Range(line, col - 1, line, col),
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    });
}

const wm = new WeakMap<TTokenStream, readonly CDiagBase[]>();

export function getAssignErr(DocStrMap: TTokenStream): readonly CDiagBase[] {
    const cache: readonly CDiagBase[] | undefined = wm.get(DocStrMap);
    if (cache !== undefined) return cache;

    const diagList: CDiagBase[] = [];

    for (const token of DocStrMap) {
        if (!token.displayErr) continue;

        const ed1: CDiagBase | null = assignErr(token, DocStrMap);
        if (ed1 !== null) diagList.push(ed1);
    }

    wm.set(DocStrMap, diagList);
    return diagList;
}
