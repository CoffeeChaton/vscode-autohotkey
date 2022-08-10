import * as vscode from 'vscode';
import type { TParamMapOut, TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../../../provider/Diagnostic/tools/CDiagFn';

export function NeverUsedParam(
    paramMap: TParamMapOut,
    code501List: CDiagFn[],
    displayErrList: readonly boolean[],
): void {
    for (const v of paramMap.values()) {
        if (v.refRangeList.length > 0) continue;
        if (v.keyRawName.startsWith('_')) continue;
        if (!displayErrList[v.defRangeList[0].start.line]) continue;

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

export function NeverUsedVar(
    valMap: TValMapOut,
    code500List: CDiagFn[],
    code500Max: number,
    displayErrList: readonly boolean[],
): void {
    if (code500List.length >= code500Max) return;

    for (const [key, v] of valMap) {
        if (v.refRangeList.length > 0) continue;
        // if (v.defRangeList.length > 1) return; // don't open this with out debug
        if (
            key.startsWith('A_')
            || key.startsWith('_')
            || key === 'CLIPBOARD'
            || key === 'CLIPBOARDALL'
            || key === 'ERRORLEVEL'
            || !displayErrList[v.defRangeList[0].start.line]
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
        if (code500List.length >= code500Max) return;
    }
}

// FIXME: EDiagCodeDA.code501
// IniRead(Filename, Section, Key, Default = "") {
//     IniRead, v, %Filename%, %Section%, %Key%, %Default%
//     Return, v
// }
