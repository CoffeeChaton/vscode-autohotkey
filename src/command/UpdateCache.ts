import * as vscode from 'vscode';
import { rmAllDiag } from '../core/diagColl';
import { BaseScanMemo } from '../core/ParserTools/getFileAST';
import type { TAhkFileData } from '../core/ProjectManager';
import { pm } from '../core/ProjectManager';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { getUriList } from '../tools/fsTools/getUriList';

export async function UpdateCacheAsync(clearCache: boolean): Promise<TAhkFileData[] | null> {
    rmAllDiag();
    pm.DocMap.clear();
    if (clearCache) {
        BaseScanMemo.memo.clear();
    }

    const uriList: vscode.Uri[] | null = getUriList();
    if (uriList === null) return null;

    const FileListData: TAhkFileData[] = [];
    for (const uri of uriList) {
        FileListData.push(
            // In the same PC, IO is relatively fast, but this decision is made for the workload of GC each time
            // and await in loop can run faster
            // eslint-disable-next-line no-await-in-loop
            await vscode.workspace.openTextDocument(uri)
                .then((doc: vscode.TextDocument): TAhkFileData => pm.updateDocDef(doc)),
        );
    }

    return FileListData;
}

export async function UpdateCacheUi(): Promise<void> {
    const t1: number = Date.now();
    await UpdateCacheAsync(true);
    const t2: number = Date.now();
    OutputChannel.appendLine(`Refresh Resource ${t2 - t1} ms`);
    OutputChannel.show();
}
