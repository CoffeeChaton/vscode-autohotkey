import * as vscode from 'vscode';
import { DiagsDA, EDiagCodeDA } from '../../../diag';
import { TArgMap } from '../../../globalEnum';
import { setDiagnosticDA } from '../../../provider/Diagnostic/setDiagnostic';

export function paramNeverUsed(argMap: TArgMap): vscode.Diagnostic[] {
    const diagS: vscode.Diagnostic[] = [];
    argMap.forEach((v): void => {
        if (!(v.refLoc.length === 0)) return;
        if (v.keyRawName.startsWith('_')) return;
        const { range } = v.defLoc[0];
        const severity = vscode.DiagnosticSeverity.Warning;
        const tags = [vscode.DiagnosticTag.Unnecessary];
        const message: string = DiagsDA[EDiagCodeDA.code501].msg;
        const diag: vscode.Diagnostic = setDiagnosticDA(EDiagCodeDA.code501, range, severity, tags, message);
        diagS.push(diag);
    });
    return diagS;
}
