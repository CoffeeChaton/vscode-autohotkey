import * as vscode from 'vscode';
import { Diags, EDiagCode } from '../../diag';
import { EDiagBase } from '../../globalEnum';
import { IgnoreArgNeverUsed } from './IgnoreArgNeverUsed';

function getFsPath(diag: vscode.Diagnostic): string | null {
    const code = diag?.code;
    if (code === undefined || typeof code === 'string' || typeof code === 'number') return null;
    // console.log('🚀 ~ getFsPath ~ code', code);

    const d = code.value as EDiagCode;
    const path = Diags[d]?.path;
    if (path) {
        return path;
    }
    return null;
}

function setEdit(uri: vscode.Uri, line: number, FsPath: string): vscode.WorkspaceEdit {
    const position = new vscode.Position(line, 0);
    const Today = new Date();
    const newText = `${EDiagBase.ignore} 1 line; at ${Today.toLocaleString()} ; ${FsPath}\n`;
    const edit = new vscode.WorkspaceEdit();
    edit.insert(uri, position, newText);
    return edit;
}

function setIgnore(uri: vscode.Uri, diag: vscode.Diagnostic): null | vscode.CodeAction {
    const FsPath: string | null = getFsPath(diag);
    if (FsPath === null) return null;
    // eslint-disable-next-line no-magic-numbers
    if (FsPath === Diags[501].path) return IgnoreArgNeverUsed(uri, diag);

    const CA = new vscode.CodeAction('ignore line');
    CA.edit = setEdit(uri, diag.range.start.line, FsPath);
    CA.kind = vscode.CodeActionKind.QuickFix;
    //  CA.diagnostics = [diag];
    return CA;
}
export class CodeActionProvider implements vscode.CodeActionProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideCodeActions(
        document: vscode.TextDocument,
        _range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[] | null> {
        if (context.diagnostics.length === 0) return null;
        const { uri } = document;
        const CAList: vscode.CodeAction[] = [];
        for (const diag of context.diagnostics) {
            const CA = setIgnore(uri, diag);
            if (CA) CAList.push(CA);
        }

        return CAList;
    }
}
