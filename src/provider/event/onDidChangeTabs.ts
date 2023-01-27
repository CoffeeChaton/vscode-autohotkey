import * as fs from 'node:fs';
import * as vscode from 'vscode';
import { needDiag } from '../../configUI';
import { rmFileDiag } from '../../core/diagColl';
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
