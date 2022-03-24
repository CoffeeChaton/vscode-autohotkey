import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { TArgMap } from '../../../../globalEnum';
import { setDiagnosticDA } from '../../../../provider/Diagnostic/tools/setDiagnostic';

export function paramVariadicErr(argMap: TArgMap, code504List: Set<vscode.Diagnostic>): void {
    const rightIndex = argMap.size - 1;
    let i = 0;
    for (const ArgAnalysis of argMap.values()) {
        const { isVariadic, defRangeList } = ArgAnalysis;
        if (isVariadic && (i !== rightIndex)) {
            const range = defRangeList[0];
            const severity = vscode.DiagnosticSeverity.Error;
            const message: string = DiagsDA[EDiagCodeDA.code504].msg;
            const diag: vscode.Diagnostic = setDiagnosticDA(EDiagCodeDA.code504, range, severity, [], message);
            code504List.add(diag);
        }
        i++;
    }
}
