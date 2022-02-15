/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable immutable/no-mutation */
import * as vscode from 'vscode';
import { EDiagBase, EDiagCode, EDiagFsPath } from '../../globalEnum';

function consoleDefault(d: never, diag: vscode.Diagnostic): null {
    console.log('--99--66-33--44 Default -> a', d);
    // console.log('diag', diag);
    return null;
}

function getFsPath(diag: vscode.Diagnostic): EDiagFsPath | null {
    const code = diag?.code;
    if (code === undefined || typeof code === 'string' || typeof code === 'number') return null;

    const d = code.value as EDiagCode;
    // dprint-ignore
    switch (d) {
        case EDiagCode.code107: return EDiagFsPath.code107;
        case EDiagCode.code110: return EDiagFsPath.code110;
        case EDiagCode.code111: return EDiagFsPath.code111;
        case EDiagCode.code112: return EDiagFsPath.code112;
        case EDiagCode.code113: return EDiagFsPath.code113;
        case EDiagCode.code114: return EDiagFsPath.code114;
        case EDiagCode.code201: return EDiagFsPath.code201;
        case EDiagCode.code301: return EDiagFsPath.code301;
        case EDiagCode.code501: return EDiagFsPath.code501;
        case EDiagCode.code700: return EDiagFsPath.code700;
        case EDiagCode.code801: return EDiagFsPath.code801;
        case EDiagCode.code802: return EDiagFsPath.code802;
        case EDiagCode.code901: return EDiagFsPath.code901;
        case EDiagCode.code902: return EDiagFsPath.code902;
        case EDiagCode.code903: return EDiagFsPath.code903;
        default: return consoleDefault(d, diag);
    }
}

function setEdit(uri: vscode.Uri, line: number, FsPath: EDiagFsPath): vscode.WorkspaceEdit {
    const position = new vscode.Position(line, 0);
    const Today = new Date();
    const newText = `${EDiagBase.ignore} 1 line; at ${Today.toLocaleString()} ; ${FsPath}\n`;
    const edit = new vscode.WorkspaceEdit();
    edit.insert(uri, position, newText);
    return edit;
}

function setIgnoreLine(uri: vscode.Uri, diag: vscode.Diagnostic): null | vscode.CodeAction {
    // diag
    //    code: 102
    //    message: "assign warning"
    //    range: (2)[{...}, {...}]
    //    severity: "Information"
    //    source: "neko help"
    const FsPath = getFsPath(diag);
    if (FsPath === null) return null;
    const CA = new vscode.CodeAction('ignore line');
    CA.edit = setEdit(uri, diag.range.start.line, FsPath);
    CA.kind = vscode.CodeActionKind.QuickFix;
    //  CA.diagnostics = [diag];
    return CA;
}
export class CodeActionProvider implements vscode.CodeActionProvider {
    public provideCodeActions(
        document: vscode.TextDocument,
        range: vscode.Range | vscode.Selection,
        context: vscode.CodeActionContext,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[] | null> {
        if (context.diagnostics.length === 0) return null;
        const { uri } = document;
        const CAList: vscode.CodeAction[] = [];
        for (const diag of context.diagnostics) {
            const CA = setIgnoreLine(uri, diag);
            if (CA) CAList.push(CA);
        }

        return CAList;
    }
}
