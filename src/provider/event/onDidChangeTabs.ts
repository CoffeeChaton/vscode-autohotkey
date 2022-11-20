import * as fs from 'node:fs';
import * as vscode from 'vscode';
import { rmFileDiag } from '../../core/diagColl';
import { delOldCache, pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import { isAhkTab } from '../../tools/fsTools/isAhk';
import { setBaseDiag } from '../Diagnostic/setBaseDiag';

export function onDidChangeActiveTab(e: vscode.TextEditor | undefined): undefined {
    if (e === undefined) return undefined;

    const { document } = e;
    const { uri } = document;
    if (isAhkTab(uri)) {
        const { AST, DocStrMap, ModuleVar } = pm.getDocMap(uri.fsPath) ?? pm.updateDocDef(document);
        setBaseDiag(uri, DocStrMap, AST);
        digDAFile(getDAListTop(AST), ModuleVar, uri, DocStrMap);
    }

    return undefined;
}

function checkPmFileExist(): void {
    // Where should I watch of a files exists?
    // better model? https://devblogs.microsoft.com/typescript/announcing-typescript-4-9-beta/#file-watching-changes
    for (const [fsPath, { uri }] of pm.DocMap) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (!fs.existsSync(fsPath)) {
            delOldCache(uri);
        }
    }
}

export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
    for (const tab of tabChangeEvent.closed) {
        if (!(tab.input instanceof vscode.TabInputText)) continue;

        const { uri } = tab.input;
        if (isAhkTab(uri)) {
            rmFileDiag(uri); // clear all diag of ahk-neko-help

            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (!fs.existsSync(uri.fsPath)) {
                delOldCache(uri);
                checkPmFileExist();
            }
        }
    }
}
