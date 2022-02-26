import * as vscode from 'vscode';

export function c502c503CodeAction(uri: vscode.Uri, diag: vscode.Diagnostic): null | vscode.CodeAction {
    const magStrList: string[] = [];
    for (const magic of diag.message.matchAll(/"(\w+)"/uig)) {
        magStrList.push(magic[1]);
    }

    // magicString of
    // var "A" is the same variable as "a" defined earlier (at [165, 20])
    // eslint-disable-next-line no-magic-numbers
    if (magStrList.length !== 2) return null;

    magStrList.reverse();
    const title = `replace this as "${magStrList[0]}"`;
    const CA = new vscode.CodeAction(title);

    const edit = new vscode.WorkspaceEdit();
    edit.replace(uri, diag.range, magStrList[0]);

    CA.edit = edit;
    CA.kind = vscode.CodeActionKind.QuickFix;

    // TODO replace Def As Ref
    return CA;
}
