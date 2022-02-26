import * as vscode from 'vscode';
import { getCode502Default, getCode503Default } from '../../../configUI';
import { EDiagCodeDA } from '../../../diag';
import { TArgMap, TValMap } from '../../../globalEnum';
import { setDiagnosticDA } from '../../../provider/Diagnostic/setDiagnostic';
import { setDiagCaseMsg } from './caseSensitivityMagic';

export function caseSensitivityVar(valMap: TValMap, code502List: vscode.Diagnostic[]): vscode.Diagnostic[] {
    if (code502List.length > getCode502Default()) {
        return code502List;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_, ValAnalysis] of valMap) {
        const { c502List } = ValAnalysis;
        for (const C502 of c502List) {
            const { range } = C502;
            const c502Name: string = C502.varName;
            const defPos: vscode.Position = ValAnalysis.defLoc[0].range.start;
            const message: string = setDiagCaseMsg(ValAnalysis.keyRawName, defPos, c502Name, 'var');

            const severity = vscode.DiagnosticSeverity.Information;
            const diag: vscode.Diagnostic = setDiagnosticDA(EDiagCodeDA.code502, range, severity, [], message);

            code502List.push(diag);
            if (code502List.length > getCode502Default()) {
                return code502List;
            }
        }
    }
    return code502List;
}

export function caseSensitivityParam(argMap: TArgMap, code503List: vscode.Diagnostic[]): vscode.Diagnostic[] {
    if (code503List.length > getCode503Default()) {
        return code503List;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_, ArgAnalysis] of argMap) {
        const { c503List } = ArgAnalysis;
        for (const C503 of c503List) {
            const { range } = C503;
            const c503Name: string = C503.ParamNewName;
            const defPos: vscode.Position = ArgAnalysis.defLoc[0].range.start;
            const message: string = setDiagCaseMsg(ArgAnalysis.keyRawName, defPos, c503Name, 'param');

            const severity = vscode.DiagnosticSeverity.Information;
            const diag: vscode.Diagnostic = setDiagnosticDA(EDiagCodeDA.code503, range, severity, [], message);

            code503List.push(diag);
            if (code503List.length > getCode502Default()) {
                return code503List;
            }
        }
    }
    return code503List;
}
