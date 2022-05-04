import * as vscode from 'vscode';
import { TParamMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { setDiagnosticDA } from '../../../../provider/Diagnostic/tools/setDiagnostic';

export function paramVariadicErr(paramMap: TParamMapOut, code504List: vscode.Diagnostic[]): void {
    const rightIndex = paramMap.size - 1;
    let i = 0;
    for (const ArgAnalysis of paramMap.values()) {
        const { isVariadic, defRangeList } = ArgAnalysis;
        if (isVariadic && (i !== rightIndex)) {
            code504List.push(setDiagnosticDA(
                EDiagCodeDA.code504,
                defRangeList[0],
                vscode.DiagnosticSeverity.Error,
                [],
                DiagsDA[EDiagCodeDA.code504].msg,
            ));
        }
        i++;
    }
}
