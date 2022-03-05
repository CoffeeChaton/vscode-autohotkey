import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { TArgMap } from '../../../../globalEnum';
import { setDiagnosticDA } from '../../../../provider/Diagnostic/setDiagnostic';

export function paramNeverUsed(argMap: TArgMap, code501List: Set<vscode.Diagnostic>): void {
    argMap.forEach((v): void => {
        if (!(v.refRangeList.length === 0)) return;
        if (v.keyRawName.startsWith('_')) return;
        const range = v.defRangeList[0];
        const severity = vscode.DiagnosticSeverity.Warning;
        const tags = [vscode.DiagnosticTag.Unnecessary];
        const message: string = DiagsDA[EDiagCodeDA.code501].msg;
        const diag: vscode.Diagnostic = setDiagnosticDA(EDiagCodeDA.code501, range, severity, tags, message);
        code501List.add(diag);
    });
}
