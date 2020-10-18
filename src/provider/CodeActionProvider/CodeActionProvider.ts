/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { EDiagnostic } from '../../globalEnum';

function caseOf107(uri: vscode.Uri, diag: vscode.Diagnostic): vscode.CodeAction {
    // console.log('CodeActionProvider -> context', context);
    // diag
    //    code: 102
    //    message: "assign warning"
    //    range: (2)[{ … }, { … }]
    //    severity: "Information"
    //    source: "neko help"
    const { line } = diag.range.start;
    const edit = new vscode.WorkspaceEdit();
    const position = new vscode.Position(line, 0);
    const Today = new Date();
    const newText = `${EDiagnostic.ParserIgnore} 1 line; at ${Today.toLocaleString()}\n`;
    edit.insert(uri, position, newText);
    const CA = new vscode.CodeAction(`ignore line ${line + 1}`);
    CA.edit = edit;
    return CA;
}
export class CodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext, token: vscode.CancellationToken)
        : vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[] | null> {
        if (context.diagnostics.length === 0) return null;
        const { uri } = document;
        const CAList: vscode.CodeAction[] = [];
        for (const diag of context.diagnostics) {
            switch (diag.code) {
                case EDiagnostic.code107:
                    CAList.push(caseOf107(uri, diag));
                    break;
                default:
                    console.log('CodeActionProvider -> code is not in any case', diag.code);
                    break;
            }
        }

        return CAList;
    }

    //  resolveCodeAction?(codeAction: T, token: CancellationToken): ProviderResult<T>;
}
