import * as vscode from 'vscode';
import { diagColl, pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { isAhkTab } from '../../tools/fsTools/isAhk';
import { CDiagFn } from '../Diagnostic/tools/CDiagFn';

export function onDidChangeActiveTab(e: vscode.TextEditor | undefined): undefined {
    if (e === undefined) return undefined;

    const { document } = e;
    const { uri } = document;
    if (isAhkTab(uri)) {
        const { AST, DocStrMap, ModuleVar } = pm.getDocMap(uri.fsPath) ?? pm.updateDocDef(document);
        digDAFile(getDAList(AST), ModuleVar, uri, DocStrMap);
    }

    return undefined;
}

export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
    for (const tab of tabChangeEvent.closed) {
        if (!(tab.input instanceof vscode.TabInputText)) continue;

        const { uri } = tab.input;
        if (isAhkTab(uri)) {
            // clearNekoDA
            const diagList: readonly vscode.Diagnostic[] | undefined = diagColl.get(uri);
            if (diagList !== undefined) {
                diagColl.set(uri, diagList.filter((diag: vscode.Diagnostic): boolean => !(diag instanceof CDiagFn)));
            }
        }
    }
}
