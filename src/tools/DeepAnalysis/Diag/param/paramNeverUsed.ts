import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { setDiagnosticDA } from '../../../../provider/Diagnostic/tools/setDiagnostic';
import {
    TParamMap,
    TParamMeta,
    TValMap,
    TValMeta,
} from '../../TypeFnMeta';

export function paramNeverUsed(paramMap: TParamMap, code501List: Set<vscode.Diagnostic>): void {
    paramMap.forEach((v: TParamMeta): void => {
        if (v.refRangeList.length > 0) return;
        if (v.keyRawName.startsWith('_')) return;

        code501List.add(setDiagnosticDA(
            EDiagCodeDA.code501,
            v.defRangeList[0],
            vscode.DiagnosticSeverity.Warning,
            [vscode.DiagnosticTag.Unnecessary],
            DiagsDA[EDiagCodeDA.code501].msg,
        ));
    });
}

export function varNeverUsed(valMap: TValMap, code500List: Set<vscode.Diagnostic>): void {
    valMap.forEach((v: TValMeta, key: string): void => {
        if (v.refRangeList.length > 0) return;
        // if (v.defRangeList.length > 1) return;
        if (
            key.startsWith('A_')
            || key.startsWith('_')
            || key === 'Clipboard'.toUpperCase()
            || key === 'ClipboardAll'.toUpperCase()
            || key === 'ErrorLevel'.toUpperCase()
        ) {
            return;
        }
        code500List.add(setDiagnosticDA(
            EDiagCodeDA.code500,
            v.defRangeList[0],
            vscode.DiagnosticSeverity.Warning,
            [vscode.DiagnosticTag.Unnecessary],
            DiagsDA[EDiagCodeDA.code500].msg,
        ));
    });
}
