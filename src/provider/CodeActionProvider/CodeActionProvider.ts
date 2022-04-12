import * as vscode from 'vscode';
import { Diags, EDiagCode, EDiagCodeDA } from '../../diag';
import { EDiagBase } from '../../globalEnum';
import { c501ignoreArgNeverUsed } from './c501ignoreArgNeverUsed';
import { c502c503CodeAction } from './c502c503CodeAction';

function getFsPath(diag: vscode.Diagnostic): string | null {
    const code = diag?.code;
    if (code === undefined || typeof code === 'string' || typeof code === 'number') return null;

    const d: EDiagCode = code.value as EDiagCode;
    const path: string | undefined = Diags[d]?.path;
    if (path !== undefined) {
        return path;
    }
    return null;
}

function setEdit(uri: vscode.Uri, line: number, FsPath: string): vscode.WorkspaceEdit {
    const position: vscode.Position = new vscode.Position(line, 0);
    const Today: Date = new Date();
    const newText = `${EDiagBase.ignore} 1 line; at ${Today.toLocaleString()} ; ${FsPath}\n`;
    const edit: vscode.WorkspaceEdit = new vscode.WorkspaceEdit();
    edit.insert(uri, position, newText);
    return edit;
}

function setIgnore(uri: vscode.Uri, diag: vscode.Diagnostic): null | vscode.CodeAction {
    const FsPath: string | null = getFsPath(diag);
    if (FsPath === null) return null;

    const CA: vscode.CodeAction = new vscode.CodeAction('ignore line');
    CA.edit = setEdit(uri, diag.range.start.line, FsPath);
    CA.kind = vscode.CodeActionKind.QuickFix;
    //  CA.diagnostics = [diag];
    return CA;
}

function codeActionOfDA(uri: vscode.Uri, diag: vscode.Diagnostic): vscode.CodeAction[] {
    const code = diag?.code;
    if (code === undefined || typeof code === 'string' || typeof code === 'number') return [];
    const { value } = code;
    if (value === EDiagCodeDA.code501) {
        return [c501ignoreArgNeverUsed(uri, diag)];
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
        } else if (diag.source === EDiagBase.sourceDA) {
            CAList.push(...codeActionOfDA(uri, diag));
        }
    }

    return CAList;
}

export const CodeActionProvider: vscode.CodeActionProvider = {
    provideCodeActions(
        document: vscode.TextDocument,
        _range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[] | null> {
        return fixDiag(document.uri, context.diagnostics);
    },
};
