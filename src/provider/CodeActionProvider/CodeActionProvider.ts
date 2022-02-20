import * as vscode from 'vscode';
import { EDiagBase, EDiagCode, EDiagFsPath } from '../../globalEnum';
import { IgnoreArgNeverUsed } from './IgnoreArgNeverUsed';

function consoleDefault(d: never, _diag: vscode.Diagnostic): null {
    console.log('--99--66-33--44 Default -> a', d);
    // console.log('diag', diag);
    return null;
}

// eslint-disable-next-line complexity
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
        case EDiagCode.code803: return EDiagFsPath.code803;
        case EDiagCode.code804: return EDiagFsPath.code804;
        case EDiagCode.code805: return EDiagFsPath.code805;
        case EDiagCode.code806: return EDiagFsPath.code806;
        case EDiagCode.code807: return EDiagFsPath.code807;
        case EDiagCode.code808: return EDiagFsPath.code808;
        case EDiagCode.code809: return EDiagFsPath.code809;
        case EDiagCode.code810: return EDiagFsPath.code810;
        case EDiagCode.code811: return EDiagFsPath.code811;
        case EDiagCode.code812: return EDiagFsPath.code812;
        case EDiagCode.code813: return EDiagFsPath.code813;
        case EDiagCode.code814: return EDiagFsPath.code814;
        case EDiagCode.code815: return EDiagFsPath.code815;
        case EDiagCode.code816: return EDiagFsPath.code816;
        case EDiagCode.code817: return EDiagFsPath.code817;
        case EDiagCode.code818: return EDiagFsPath.code818;
        case EDiagCode.code819: return EDiagFsPath.code819;
        case EDiagCode.code820: return EDiagFsPath.code820;
        case EDiagCode.code821: return EDiagFsPath.code821;
        case EDiagCode.code822: return EDiagFsPath.code822;
        case EDiagCode.code823: return EDiagFsPath.code823;
        case EDiagCode.code824: return EDiagFsPath.code824;
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

function setIgnore(uri: vscode.Uri, diag: vscode.Diagnostic): null | vscode.CodeAction {
    // diag
    //    code: 102
    //    message: "assign warning"
    //    range: (2)[{...}, {...}]
    //    severity: "Information"
    //    source: "neko help"
    const FsPath = getFsPath(diag);
    if (FsPath === null) return null;
    if (FsPath === EDiagFsPath.code501) return IgnoreArgNeverUsed(uri, diag);

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
