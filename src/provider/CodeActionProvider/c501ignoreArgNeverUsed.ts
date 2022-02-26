import * as vscode from 'vscode';

export function c501ignoreArgNeverUsed(uri: vscode.Uri, diag: vscode.Diagnostic): vscode.CodeAction {
    const edit = new vscode.WorkspaceEdit();
    edit.insert(uri, diag.range.start, '_');

    const CA = new vscode.CodeAction('Prefix arg with underscore');
    CA.edit = edit;
    CA.kind = vscode.CodeActionKind.QuickFix;

    return CA;
}
