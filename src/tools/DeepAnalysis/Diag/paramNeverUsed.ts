import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import { TArgMap } from '../../../globalEnum';
import { setDiagnostic } from '../../../provider/Diagnostic/setDiagnostic';

export function paramNeverUsed(argMap: TArgMap): vscode.Diagnostic[] {
    const diagS: vscode.Diagnostic[] = [];
    argMap.forEach((v): void => {
        if (!(v.refLoc.length === 0)) return;
        if (v.keyRawName.startsWith('_')) return;
        const { range } = v.defLoc[0];
        const severity = vscode.DiagnosticSeverity.Warning;
        const tags = [vscode.DiagnosticTag.Unnecessary];
        const diag: vscode.Diagnostic = setDiagnostic(EDiagCode.code501, range, severity, tags);
        diagS.push(diag);
    });
    return diagS;
}
