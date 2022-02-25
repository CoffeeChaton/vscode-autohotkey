import * as vscode from 'vscode';
import { Diags, EDiagCode } from '../../diag';
import {
    EDiagBase,
} from '../../globalEnum';

export function setDiagnostic(
    value: EDiagCode,
    range: vscode.Range,
    severity: vscode.DiagnosticSeverity,
    tags: vscode.DiagnosticTag[],
): vscode.Diagnostic {
    const message = Diags[value].msg;
    const target = vscode.Uri.parse(Diags[value].path);
    const diag1 = new vscode.Diagnostic(range, message, severity);
    diag1.source = EDiagBase.source;
    diag1.code = { value, target };
    diag1.tags = tags;
    return diag1;
}

export function setDiagnosticDA(
    value: EDiagCode,
    range: vscode.Range,
    severity: vscode.DiagnosticSeverity,
    tags: vscode.DiagnosticTag[],
    message: string,
): vscode.Diagnostic {
    const target = vscode.Uri.parse(Diags[value].path);
    const diag1 = new vscode.Diagnostic(range, message, severity);
    diag1.source = EDiagBase.source;
    diag1.code = { value, target };
    diag1.tags = tags;
    return diag1;
}
