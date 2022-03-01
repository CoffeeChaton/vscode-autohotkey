import * as vscode from 'vscode';
import { EDiagCodeDA } from '../../../diag';
import { TC502New, TParamOrValMap } from '../../../globalEnum';
import { setDiagnosticDA } from '../../../provider/Diagnostic/setDiagnostic';
import { setDiagCaseMsg } from './caseSensitivityMagic';

function getRangeOfC502(defLocList: vscode.Location[], refLocList: vscode.Location[], i: number): vscode.Range {
    const defLocListLen = defLocList.length;
    if (defLocListLen > i) {
        return defLocList[i].range;
    }
    return refLocList[i - defLocListLen].range;
}

export function caseSensitivityVar(
    prefix: string,
    paramOrValMap: TParamOrValMap,
    code502or503List: vscode.Diagnostic[],
    maxDiag: number,
): void {
    if (code502or503List.length >= maxDiag) {
        return;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_, ValAnalysis] of paramOrValMap) {
        const { c502Array, defLocList, refLocList } = ValAnalysis;

        const c502ArrayLen = c502Array.length;
        for (let i = 0; i < c502ArrayLen; i++) {
            const C502: TC502New = c502Array[i];
            if (C502 === 0) continue;

            const range = getRangeOfC502(defLocList, refLocList, i);
            const defPos: vscode.Position = ValAnalysis.defLocList[0].range.start;
            const diag: vscode.Diagnostic = setDiagnosticDA(
                EDiagCodeDA.code502,
                range,
                vscode.DiagnosticSeverity.Information,
                [],
                setDiagCaseMsg(ValAnalysis.keyRawName, defPos, C502, prefix),
            );

            code502or503List.push(diag);
            if (code502or503List.length >= maxDiag) {
                return;
            }
        }
    }
}
