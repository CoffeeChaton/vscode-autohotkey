import * as vscode from 'vscode';

export function c501ignoreArgNeverUsed(uri: vscode.Uri, diag: vscode.Diagnostic): null | vscode.CodeAction {
    // diag
    //    code: 102
    //    message: "assign warning"
    //    range: (2)[{...}, {...}]
    //    severity: "Information"
    //    source: "neko help"
    const CA = new vscode.CodeAction('Prefix arg with underscore');

    const edit = new vscode.WorkspaceEdit();
    edit.insert(uri, diag.range.start, '_');

    CA.edit = edit;
    CA.kind = vscode.CodeActionKind.QuickFix;

    return CA;
}
