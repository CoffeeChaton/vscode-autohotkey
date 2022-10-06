import * as vscode from 'vscode';
import { Diags, DiagsDA, EDiagCodeDA } from '../../diag';
import { EDiagBase } from '../../Enum/EDiagBase';
import { isAhk } from '../../tools/fsTools/isAhk';
import { CDiagBase } from '../Diagnostic/tools/CDiagBase';
import { CDiagFn } from '../Diagnostic/tools/CDiagFn';
import { C502Class } from '../Diagnostic/tools/CDiagFnLib/C502Class';
import { C506Class } from '../Diagnostic/tools/CDiagFnLib/C506Class';
import { DependencyAnalysis } from './DependencyAnalysis';
import { c501ignoreArgNeverUsed } from './tools/c501ignoreArgNeverUsed';
import { c502c503CodeAction } from './tools/c502c503CodeAction';
import { c506CodeAction } from './tools/c506CodeAction';

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

    const position: vscode.Position = new vscode.Position(range.start.line, 0);
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.insert(
        uri,
        position,
        `${EDiagBase.ignoreFn} 1 line; at ${(new Date()).toLocaleString()} ; ${DiagsDA[value].msg}\n`,
    );

    const CA: vscode.CodeAction = new vscode.CodeAction('ignore line');
    CA.kind = vscode.CodeActionKind.QuickFix;
    CA.edit = edit;

    if (value === EDiagCodeDA.code501) {
        return [CA, c501ignoreArgNeverUsed(uri, range.start)];
    }
    if (diag instanceof C502Class) {
        return [CA, ...c502c503CodeAction(uri, diag)];
    }

    if (diag instanceof C506Class) {
        return [CA, ...c506CodeAction(uri, diag)];
    }

    return [CA];
}

function fixDiag(uri: vscode.Uri, diagnostics: readonly vscode.Diagnostic[]): vscode.CodeAction[] {
    if (!isAhk(uri.fsPath)) return [];

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
