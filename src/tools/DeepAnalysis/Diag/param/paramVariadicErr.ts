import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { setDiagnosticDA } from '../../../../provider/Diagnostic/tools/setDiagnostic';
import { TArgMap } from '../../FnMetaType';

export function paramVariadicErr(argMap: TArgMap, code504List: Set<vscode.Diagnostic>): void {
    const rightIndex = argMap.size - 1;
    let i = 0;
    for (const ArgAnalysis of argMap.values()) {
        const { isVariadic, defRangeList } = ArgAnalysis;
        if (isVariadic && (i !== rightIndex)) {
            code504List.add(setDiagnosticDA(
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
