import * as fs from 'node:fs';
import * as vscode from 'vscode';
import { needDiag } from '../../configUI';
import { rmFileDiag } from '../../core/diagColl';
import { BaseScanMemo } from '../../core/ParserTools/getFileAST';
import type { TAhkFileData } from '../../core/ProjectManager';
import { delOldCache, pm } from '../../core/ProjectManager';
import { digDAFile } from '../../tools/DeepAnalysis/Diag/digDAFile';
import { isAhkTab } from '../../tools/fsTools/isAhk';
import { setBaseDiag } from '../Diagnostic/setBaseDiag';

export function onDidChangeActiveTab(e: vscode.TextEditor | undefined): void {
    if (e === undefined) return;

    const { document } = e;
    const { uri } = document;
    if (isAhkTab(uri) && needDiag()) {
        const AhkFileData: TAhkFileData | null = pm.getDocMap(uri.fsPath) ?? pm.updateDocDef(document);
        if (AhkFileData === null) return;

        setBaseDiag(AhkFileData);
        digDAFile(AhkFileData);
    }
}

function checkPmFileExist(): void {
    for (const [fsPath, { uri }] of pm.DocMap) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        if (!fs.existsSync(fsPath)) {
            delOldCache(uri);
        }
    }
}

export function onDidChangeTabs(tabChangeEvent: vscode.TabChangeEvent): void {
    /**
     * close event
     */
    for (const tab of tabChangeEvent.closed) {
        if (!(tab.input instanceof vscode.TabInputText)) continue;

        const { uri } = tab.input;
        if (isAhkTab(uri)) {
            const { fsPath } = uri;
            rmFileDiag(uri); // clear all diag of ahk-neko-help

            const isExternallyVisible: boolean | undefined = BaseScanMemo.memo.get(fsPath)?.at(-1)?.externallyVisible;
            if (isExternallyVisible !== undefined && !isExternallyVisible) {
                /**
                 * prevent unlimited memory growth
                 */
                BaseScanMemo.memo.delete(fsPath);
            }

            // eslint-disable-next-line security/detect-non-literal-fs-filename
            if (!fs.existsSync(fsPath)) {
                delOldCache(uri);
                checkPmFileExist();
            }
        }
    }
}
