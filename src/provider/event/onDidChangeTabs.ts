import * as vscode from 'vscode';
import { diagColl } from '../../core/ProjectManager';
import { CDiagFn } from '../Diagnostic/tools/CDiagFn';

export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
    for (const tab of tabChangeEvent.closed) {
        if (!(tab.input instanceof vscode.TabInputText)) continue;

        const { uri } = tab.input;
        // isAhkTab
        if (uri.scheme === 'file' && uri.fsPath.endsWith('.ahk')) {
            // clearNekoDA
            const diagList = diagColl.get(uri);
            if (diagList !== undefined) {
                diagColl.set(uri, diagList.filter((diag) => !(diag instanceof CDiagFn)));
            }
        }
    }
}
