import * as vscode from 'vscode';
import { getCode502Default } from '../../../configUI';
import { EDiagCode } from '../../../diag';
import { TValAnalysis, TValMap } from '../../../globalEnum';
import { setDiagnosticDA } from '../../../provider/Diagnostic/setDiagnostic';

function setMsg(ValAnalysis: TValAnalysis, c502Name: string): string {
    const firstName: string = ValAnalysis.keyRawName;
    const def0: vscode.Position = ValAnalysis.defLoc[0].range.start;
    const firstDefStr = `[${def0.line + 1}, ${def0.character + 1}]`;
    const message = `"${c502Name}" is the some variable as "${firstName}" defined earlier (at ${firstDefStr})`;
    // "A" is the same variable as "a" defined earlier (at a)
    return message;
}

export function caseSensitivityVar(valMap: TValMap, code502List: vscode.Diagnostic[]): vscode.Diagnostic[] {
    if (code502List.length > getCode502Default()) {
        return code502List;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_, ValAnalysis] of valMap) {
        const { c502List } = ValAnalysis;
        for (const C502 of c502List) {
            const { range } = C502.loc;
            const c502Name = C502.varName;

            const message = setMsg(ValAnalysis, c502Name);

            const severity = vscode.DiagnosticSeverity.Information;
            const diag: vscode.Diagnostic = setDiagnosticDA(EDiagCode.code502, range, severity, [], message);

            code502List.push(diag);
            if (code502List.length > getCode502Default()) {
                return code502List;
            }
        }
    }
    return code502List;
}
