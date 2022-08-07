import * as vscode from 'vscode';
import type { TParamMapOut, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../../../provider/Diagnostic/tools/CDiagFn';

export function NeverUsedParam(paramMap: TParamMapOut, code501List: CDiagFn[]): void {
    for (const v of paramMap.values()) {
        if (v.refRangeList.length > 0) continue;
        if (v.keyRawName.startsWith('_')) continue;

        code501List.push(
            new CDiagFn({
                value: EDiagCodeDA.code501,
                range: v.defRangeList[0],
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [vscode.DiagnosticTag.Unnecessary],
                message: DiagsDA[EDiagCodeDA.code501].msg,
            }),
        );
    }
}

export function NeverUsedVar(valMap: TValMapOut, code500List: CDiagFn[]): void {
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

        code500List.push(
            new CDiagFn({
                value: EDiagCodeDA.code500,
                range: v.defRangeList[0],
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [vscode.DiagnosticTag.Unnecessary],
                message: DiagsDA[EDiagCodeDA.code500].msg,
            }),
        );
        if (code500List.length > c500Max) break;
    }
}
