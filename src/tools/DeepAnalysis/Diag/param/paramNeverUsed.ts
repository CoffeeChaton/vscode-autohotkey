import * as vscode from 'vscode';
import type { TParamMapOut, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { setDiagnosticDA } from '../../../../provider/Diagnostic/tools/setDiagnostic';

export function NeverUsedParam(paramMap: TParamMapOut, code501List: vscode.Diagnostic[]): void {
    for (const v of paramMap.values()) {
        if (v.refRangeList.length > 0) continue;
        if (v.keyRawName.startsWith('_')) continue;

        code501List.push(setDiagnosticDA(
            EDiagCodeDA.code501,
            v.defRangeList[0],
            vscode.DiagnosticSeverity.Warning,
            [vscode.DiagnosticTag.Unnecessary],
            DiagsDA[EDiagCodeDA.code501].msg,
        ));
    }
}

export function NeverUsedVar(valMap: TValMapOut, code500List: vscode.Diagnostic[]): void {
    const c500Max = 20;
    if (code500List.length > c500Max) return;

    for (const [key, v] of valMap) {
        if (v.refRangeList.length > 0) continue;
        // if (v.defRangeList.length > 1) return;
        if (
            key.startsWith('A_')
            || key.startsWith('_')
            || key === 'Clipboard'.toUpperCase()
            || key === 'ClipboardAll'.toUpperCase()
            || key === 'ErrorLevel'.toUpperCase()
        ) {
            continue;
        }

        code500List.push(setDiagnosticDA(
            EDiagCodeDA.code500,
            v.defRangeList[0],
            vscode.DiagnosticSeverity.Warning,
            [vscode.DiagnosticTag.Unnecessary],
            DiagsDA[EDiagCodeDA.code500].msg,
        ));
        if (code500List.length > c500Max) break;
    }
}
