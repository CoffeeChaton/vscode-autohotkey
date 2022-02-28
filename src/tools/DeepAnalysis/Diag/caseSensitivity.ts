import * as vscode from 'vscode';
import { getCode502Default, getCode503Default } from '../../../configUI';
import { EDiagCodeDA } from '../../../diag';
import { TArgMap, TC502New, TValMap } from '../../../globalEnum';
import { setDiagnosticDA } from '../../../provider/Diagnostic/setDiagnostic';
import { setDiagCaseMsg } from './caseSensitivityMagic';

function getRangeOfC502(defLocList: vscode.Location[], refLocList: vscode.Location[], i: number): vscode.Range {
    const defLocListLen = defLocList.length;

    if (defLocListLen > i) {
        return defLocList[i].range;
    }
    const i2 = i - defLocListLen;
    return refLocList[i2].range;
}

export function caseSensitivityVar(valMap: TValMap, code502List: vscode.Diagnostic[]): vscode.Diagnostic[] {
    if (code502List.length >= getCode502Default()) {
        return code502List;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_, ValAnalysis] of valMap) {
        const { c502Array, defLocList, refLocList } = ValAnalysis;

        const c502ArrayLen = c502Array.length;
        for (let i = 0; i < c502ArrayLen; i++) {
            const C502: TC502New = c502Array[i];
            if (C502 === 0) continue;

            const range = getRangeOfC502(defLocList, refLocList, i);
            const defPos: vscode.Position = ValAnalysis.defLocList[0].range.start;
            const diag: vscode.Diagnostic = setDiagnosticDA(
                EDiagCodeDA.code502,
                range,
                vscode.DiagnosticSeverity.Information,
                [],
                setDiagCaseMsg(ValAnalysis.keyRawName, defPos, C502, 'var'),
            );

            code502List.push(diag);
            if (code502List.length >= getCode502Default()) {
                return code502List;
            }
        }
    }
    return code502List;
}

export function caseSensitivityParam(argMap: TArgMap, code503List: vscode.Diagnostic[]): vscode.Diagnostic[] {
    if (code503List.length >= getCode503Default()) {
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
            if (code503List.length >= getCode503Default()) {
                return code503List;
            }
        }
    }
    return code503List;
}
