import * as vscode from 'vscode';
import { EDiagCodeDA } from '../../../diag';
import { TC502New, TParamOrValMap } from '../../../globalEnum';
import { setDiagnosticDA } from '../../../provider/Diagnostic/tools/setDiagnostic';
import { setDiagCaseMsg } from './caseSensitivityMagic';

function getRangeOfC502(defRangeList: vscode.Range[], refRangeList: vscode.Range[], i: number): vscode.Range {
    const defRangeListLen = defRangeList.length;
    if (defRangeListLen > i) {
        return defRangeList[i];
    }
    return refRangeList[i - defRangeListLen];
}

export function caseSensitivityVar(
    prefix: string,
    paramOrValMap: TParamOrValMap,
    code502or503List: Set<vscode.Diagnostic>,
    maxDiag: number,
): void {
    if (code502or503List.size >= maxDiag) {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_, ValAnalysis] of paramOrValMap) {
        const { c502Array, defRangeList, refRangeList } = ValAnalysis;

        const c502ArrayLen = c502Array.length;
        for (let i = 0; i < c502ArrayLen; i++) {
            const C502: TC502New = c502Array[i];
            if (C502 === 0) continue;

            const range = getRangeOfC502(defRangeList, refRangeList, i);
            const defPos: vscode.Position = ValAnalysis.defRangeList[0].start;
            const diag: vscode.Diagnostic = setDiagnosticDA(
                EDiagCodeDA.code502,
                range,
                vscode.DiagnosticSeverity.Information,
                [],
                setDiagCaseMsg(ValAnalysis.keyRawName, defPos, C502, prefix),
            );

            code502or503List.add(diag);
            if (code502or503List.size >= maxDiag) {
                return;
            }
        }
    }
}
