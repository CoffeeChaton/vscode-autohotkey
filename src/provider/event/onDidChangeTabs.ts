import * as vscode from 'vscode';
import { diagColl } from '../../core/Detecter';
import { EDiagBase } from '../../Enum/EDiagBase';

function clearNekoDA(uri: vscode.Uri): null {
    if (uri.scheme !== 'file' || uri.fsPath.endsWith('.ahk')) return null;

    const diagList: readonly vscode.Diagnostic[] | undefined = diagColl.get(uri);
    if (diagList === undefined) return null;

    diagColl.set(uri, diagList.filter((diag) => diag.source !== EDiagBase.sourceDA));
    return null;
}

export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
    for (const tab of tabChangeEvent.closed) {
        if (!(tab.input instanceof vscode.TabInputText)) continue;

        clearNekoDA(tab.input.uri);
    }
}
