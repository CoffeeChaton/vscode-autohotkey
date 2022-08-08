import * as vscode from 'vscode';
import { diagColl, pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { CDiagFn } from '../Diagnostic/tools/CDiagFn';

const isAhkTab = (uri: vscode.Uri): boolean => uri.scheme === 'file' && uri.fsPath.endsWith('.ahk');

export function onDidChangeActiveTab(e: vscode.TextEditor | undefined): undefined {
    if (e === undefined) return undefined;

    const { document } = e;
    const { uri } = document;
    if (isAhkTab(uri)) {
        const { AST } = pm.getDocMap(uri.fsPath) ?? pm.updateDocDef(document);
        digDAFile(getDAList(AST), uri);
    }

    return undefined;
}

export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
    for (const tab of tabChangeEvent.closed) {
        if (!(tab.input instanceof vscode.TabInputText)) continue;

        const { uri } = tab.input;
        if (isAhkTab(uri)) {
            // clearNekoDA
            const diagList = diagColl.get(uri);
            if (diagList !== undefined) {
                diagColl.set(uri, diagList.filter((diag) => !(diag instanceof CDiagFn)));
            }
        }
    }
}
