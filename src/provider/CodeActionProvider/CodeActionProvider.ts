import * as vscode from 'vscode';
import type { EDiagCode } from '../../diag';
import { Diags, EDiagCodeDA } from '../../diag';
import { EDiagBase } from '../../Enum/EDiagBase';
import { CDiagFn } from '../Diagnostic/tools/CDiagFn';
import { c501ignoreArgNeverUsed } from './c501ignoreArgNeverUsed';
import { c502c503CodeAction } from './c502c503CodeAction';
import { DependencyAnalysis } from './DependencyAnalysis';

function getFsPath(diag: vscode.Diagnostic): string | null {
    const { code } = diag;
    if (code === undefined || typeof code === 'string' || typeof code === 'number') return null;

    const d: EDiagCode = code.value as EDiagCode;
    return Diags[d].path;
}

function setEdit(uri: vscode.Uri, line: number, FsPath: string): vscode.WorkspaceEdit {
    const position: vscode.Position = new vscode.Position(line, 0);
    const Today: Date = new Date();
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.insert(uri, position, `${EDiagBase.ignore} 1 line; at ${Today.toLocaleString()} ; ${FsPath}\n`);
    return edit;
}

// FIXME diag -> CDiagBase
function setIgnore(uri: vscode.Uri, diag: vscode.Diagnostic): vscode.CodeAction | null {
    const FsPath: string | null = getFsPath(diag);
    if (FsPath === null) return null;

    const CA: vscode.CodeAction = new vscode.CodeAction('ignore line');
    CA.edit = setEdit(uri, diag.range.start.line, FsPath);
    CA.kind = vscode.CodeActionKind.QuickFix;
    //  CA.diagnostics = [diag];
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
        if (diag.source === EDiagBase.source) {
            const CA: vscode.CodeAction | null = setIgnore(uri, diag);
            if (CA !== null) CAList.push(CA);
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
