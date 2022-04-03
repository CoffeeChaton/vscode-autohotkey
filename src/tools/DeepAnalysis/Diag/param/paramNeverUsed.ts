import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { setDiagnosticDA } from '../../../../provider/Diagnostic/tools/setDiagnostic';
import { TArgAnalysis, TArgMap } from '../../TypeFnMeta';

export function paramNeverUsed(argMap: TArgMap, code501List: Set<vscode.Diagnostic>): void {
    argMap.forEach((v: TArgAnalysis): void => {
        if (!(v.refRangeList.length === 0)) return;
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
