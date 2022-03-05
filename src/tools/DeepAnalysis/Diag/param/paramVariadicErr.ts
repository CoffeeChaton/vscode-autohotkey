import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { TArgMap } from '../../../../globalEnum';
import { setDiagnosticDA } from '../../../../provider/Diagnostic/setDiagnostic';

export function paramVariadicErr(argMap: TArgMap, code504List: vscode.Diagnostic[]): void {
    const rightIndex = argMap.size - 1;
    let i = 0;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_k, ArgAnalysis] of argMap) {
        const { isVariadic, defRangeList: defLocList } = ArgAnalysis;
        if (isVariadic && (i !== rightIndex)) {
            const range = defLocList[0];
            const severity = vscode.DiagnosticSeverity.Error;
            const message: string = DiagsDA[EDiagCodeDA.code504].msg;
            const diag: vscode.Diagnostic = setDiagnosticDA(EDiagCodeDA.code504, range, severity, [], message);
            code504List.push(diag);
        }
        i += 1;
    }
}
