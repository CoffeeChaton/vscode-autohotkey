import * as vscode from 'vscode';
import type { TC502New, TParamMapOut, TValMapOut } from '../../../AhkSymbol/CAhkFunc';
import { EDiagCodeDA } from '../../../diag';
import { CDiagFn } from '../../../provider/Diagnostic/tools/CDiagFn';
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
    code502or503List: CDiagFn[],
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

            const diagFn: CDiagFn = new CDiagFn(
                {
                    value: EDiagCodeDA.code502,
                    range: getRangeOfC502(defRangeList, refRangeList, i),
                    severity: vscode.DiagnosticSeverity.Information,
                    tags: [],
                    message: setDiagCaseMsg(keyRawName, defPos, C502, prefix),
                },
            );
            code502or503List.push(diagFn);
            if (code502or503List.length >= maxDiag) {
                return;
            }
            break; // of  for (let i
        }
    }
}
