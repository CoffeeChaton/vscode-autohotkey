import * as vscode from 'vscode';
import type { TParamMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../../../provider/Diagnostic/tools/CDiagFn';

export function paramVariadicErr(paramMap: TParamMapOut, code504List: CDiagFn[]): void {
    const rightIndex: number = paramMap.size - 1;
    let i = 0;
    for (const ArgAnalysis of paramMap.values()) {
        const { isVariadic, defRangeList } = ArgAnalysis;
        if (isVariadic && (i !== rightIndex)) {
            code504List.push(
                new CDiagFn({
                    value: EDiagCodeDA.code504,
                    range: defRangeList[0],
                    severity: vscode.DiagnosticSeverity.Error,
                    tags: [],
                    message: DiagsDA[EDiagCodeDA.code504].msg,
                }),
            );
        }
        i++;
    }
}
