/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable class-methods-use-this */
import * as vscode from 'vscode';
import { EDiagBase, EDiagFsPath, EDiagCode } from '../../globalEnum';

function consoleDefault(a: never, diag: vscode.Diagnostic): '' {
    console.log('console.log Default -> a', a, ' --99 --66 -33 --44');
    console.log('diag', diag);
    return '';
}

function getFsPath(diag: vscode.Diagnostic): EDiagFsPath | '' {
    const d = diag.code as EDiagCode;
    // console.log('function getFsPath -> diag', diag);
    switch (d) {
        case EDiagCode.code107: return EDiagFsPath.code107;
        case EDiagCode.code110: return EDiagFsPath.code110;
        case EDiagCode.code111: return EDiagFsPath.code111;
        case EDiagCode.code112: return EDiagFsPath.code112;
        case EDiagCode.code113: return EDiagFsPath.code113;
        default: return consoleDefault(d, diag);
    }
}

function IgnoreThisLine(uri: vscode.Uri, diag: vscode.Diagnostic): vscode.CodeAction {
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
    const newText = `${EDiagBase.ignore} 1 line; at ${Today.toLocaleString()} ; ${getFsPath(diag)}\n`;
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
            CAList.push(IgnoreThisLine(uri, diag));
        }

        return CAList;
    }

    //  resolveCodeAction?(codeAction: T, token: CancellationToken): ProviderResult<T>;
}
