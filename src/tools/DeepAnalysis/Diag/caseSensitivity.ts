import * as vscode from 'vscode';
import { EDiagCodeDA } from '../../../diag';
import { setDiagnosticDA } from '../../../provider/Diagnostic/tools/setDiagnostic';
import { TC502New, TParamMap, TValMap } from '../TypeFnMeta';
import { EPrefixC502, setDiagCaseMsg } from './caseSensitivityMagic';

function getRangeOfC502(defRangeList: vscode.Range[], refRangeList: vscode.Range[], i: number): vscode.Range {
    const defRangeListLen: number = defRangeList.length;
    if (defRangeListLen > i) {
        return defRangeList[i];
    }
    return refRangeList[i - defRangeListLen];
}

export function caseSensitivityVar(
    prefix: EPrefixC502,
    paramOrValMap: TValMap | TParamMap,
    code502or503List: Set<vscode.Diagnostic>,
    maxDiag: number,
): void {
    if (code502or503List.size >= maxDiag) {
        return;
    }

    for (const ValAnalysis of paramOrValMap.values()) {
        const { c502Array, defRangeList, refRangeList } = ValAnalysis;

        const c502ArrayLen: number = c502Array.length;
        for (let i = 0; i < c502ArrayLen; i++) {
            const C502: TC502New = c502Array[i];
            if (C502 === 0) continue;

            const defPos: vscode.Position = ValAnalysis.defRangeList[0].start;
            const diag: vscode.Diagnostic = setDiagnosticDA(
                EDiagCodeDA.code502,
                getRangeOfC502(defRangeList, refRangeList, i),
                vscode.DiagnosticSeverity.Information,
                [],
                setDiagCaseMsg(ValAnalysis.keyRawName, defPos, C502, prefix),
            );

            code502or503List.add(diag);
            if (code502or503List.size >= maxDiag) {
                return;
            }
            break; // of  for (let i
        }
    }
}
