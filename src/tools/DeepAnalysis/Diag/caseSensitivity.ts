import * as vscode from 'vscode';
import type { TC502New, TParamMapOut, TValMapOut } from '../../../AhkSymbol/CAhkFunc';
import { EDiagCodeDA } from '../../../diag';
import { setDiagnosticDA } from '../../../provider/Diagnostic/tools/setDiagnostic';
import type { EPrefixC502 } from './caseSensitivityMagic';
import { setDiagCaseMsg } from './caseSensitivityMagic';

function getRangeOfC502(
    defRangeList: readonly vscode.Range[],
    refRangeList: readonly vscode.Range[],
    i: number,
): vscode.Range {
    const defRangeListLen: number = defRangeList.length;
    if (defRangeListLen > i) {
        return defRangeList[i];
    }
    return refRangeList[i - defRangeListLen];
}

export function caseSensitivityVar(
    prefix: EPrefixC502,
    paramOrValMap: TParamMapOut | TValMapOut,
    code502or503List: vscode.Diagnostic[],
    maxDiag: number,
): void {
    if (code502or503List.length >= maxDiag) {
        return;
    }

    for (const ValAnalysis of paramOrValMap.values()) {
        const {
            c502Array,
            defRangeList,
            refRangeList,
            keyRawName,
        } = ValAnalysis;

        const c502ArrayLen: number = c502Array.length;
        for (let i = 0; i < c502ArrayLen; i++) {
            const C502: TC502New = c502Array[i];
            if (C502 === 0) continue;

            const defPos: vscode.Position = defRangeList[0].start;
            const diag: vscode.Diagnostic = setDiagnosticDA(
                EDiagCodeDA.code502,
                getRangeOfC502(defRangeList, refRangeList, i),
                vscode.DiagnosticSeverity.Information,
                [],
                setDiagCaseMsg(keyRawName, defPos, C502, prefix),
            );

            code502or503List.push(diag);
            if (code502or503List.length >= maxDiag) {
                return;
            }
            break; // of  for (let i
        }
    }
}
