// eslint-disable-next-line max-classes-per-file
import * as vscode from 'vscode';
import type { EDiagCode } from '../../../diag';
import { Diags } from '../../../diag';
import { EDiagBase } from '../../../Enum/EDiagBase';

export function setDiagnostic( // FIXME rm this func
    value: EDiagCode,
    range: vscode.Range,
    severity: vscode.DiagnosticSeverity,
    tags: vscode.DiagnosticTag[],
): vscode.Diagnostic {
    const message: string = Diags[value].msg;
    const target: vscode.Uri = vscode.Uri.parse(Diags[value].path);
    const diag1: vscode.Diagnostic = new vscode.Diagnostic(range, message, severity);
    diag1.source = EDiagBase.source;
    diag1.code = { value, target };
    diag1.tags = tags;
    return diag1;
}
