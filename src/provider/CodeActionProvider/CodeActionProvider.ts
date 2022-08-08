import * as vscode from 'vscode';
import { Diags, EDiagCodeDA } from '../../diag';
import { EDiagBase } from '../../Enum/EDiagBase';
import { CDiagBase } from '../Diagnostic/tools/CDiagBase';
import { CDiagFn } from '../Diagnostic/tools/CDiagFn';
import { c501ignoreArgNeverUsed } from './c501ignoreArgNeverUsed';
import { c502c503CodeAction } from './c502c503CodeAction';
import { DependencyAnalysis } from './DependencyAnalysis';

function setIgnore(uri: vscode.Uri, diag: CDiagBase): vscode.CodeAction {
    const position: vscode.Position = new vscode.Position(diag.range.start.line, 0);
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.insert(
        uri,
        position,
        `${EDiagBase.ignore} 1 line; at ${(new Date()).toLocaleString()} ; ${Diags[diag.code.value].path}\n`,
    );

    const CA: vscode.CodeAction = new vscode.CodeAction('ignore line');
    CA.kind = vscode.CodeActionKind.QuickFix;
    CA.edit = edit;

    return CA;
}

function codeActionOfDA(uri: vscode.Uri, diag: CDiagFn): vscode.CodeAction[] {
    const { code, range } = diag;
    const { value } = code;

    if (value === EDiagCodeDA.code501) {
        return [c501ignoreArgNeverUsed(uri, range.start)];
    }
    if (value === EDiagCodeDA.code502) {
        return [...c502c503CodeAction(uri, diag)];
    }

    return [];
}

function fixDiag(uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]): vscode.CodeAction[] {
    if (!uri.fsPath.endsWith('.ahk')) return [];

    const CAList: vscode.CodeAction[] = [];
    for (const diag of diagnostics) {
        if (diag instanceof CDiagBase) {
            CAList.push(setIgnore(uri, diag));
        } else if (diag instanceof CDiagFn) {
            CAList.push(...codeActionOfDA(uri, diag));
        }
    }

    return CAList;
}

export const CodeActionProvider: vscode.CodeActionProvider = {
    provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<(vscode.CodeAction | vscode.Command)[] | null> {
        return [
            ...fixDiag(document.uri, context.diagnostics),
            ...DependencyAnalysis(document, range),
        ];
    },
};
