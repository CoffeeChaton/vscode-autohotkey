import * as vscode from 'vscode';
import { diagColl } from '../../core/ProjectManager';
import { EDiagBase } from '../../Enum/EDiagBase';

function clearNekoDA(uri: vscode.Uri): null {
    const diagList: readonly vscode.Diagnostic[] | undefined = diagColl.get(uri);
    if (diagList === undefined) return null;

    diagColl.set(uri, diagList.filter((diag) => diag.source !== EDiagBase.sourceDA));
    return null;
}

function isAhkTab(uri: vscode.Uri): boolean {
    return uri.scheme === 'file' && uri.fsPath.endsWith('.ahk');
}

export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
    for (const tab of tabChangeEvent.closed) {
        if (!(tab.input instanceof vscode.TabInputText)) continue;

        const { uri } = tab.input;
        if (isAhkTab(uri)) {
            clearNekoDA(uri);
        }
    }
}
