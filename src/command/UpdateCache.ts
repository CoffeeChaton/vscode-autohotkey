import * as vscode from 'vscode';
import { BaseScanMemo } from '../core/BaseScanMemo/memo';
import type { TAhkFileData } from '../core/Detecter';
import { Detecter } from '../core/Detecter';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { getUriList } from '../tools/fsTools/getUriList';

export async function UpdateCacheAsync(clearCache: boolean): Promise<TAhkFileData[] | null> {
    Detecter.DocMap.clear();
    if (clearCache) {
        BaseScanMemo.memo.clear();
    }

    const uriList: vscode.Uri[] | null = getUriList();
    if (uriList === null) return null;

    const waitDocFullData: Thenable<TAhkFileData>[] = [];
    for (const uri of uriList) {
        waitDocFullData.push(
            vscode.workspace
                .openTextDocument(uri)
                .then((doc: vscode.TextDocument): TAhkFileData => Detecter.updateDocDef(doc)),
        );
    }

    const FileListData: TAhkFileData[] = await Promise.all(waitDocFullData);

    return FileListData;
}

export async function fnRefreshResource(): Promise<void> {
    const t1: number = Date.now();
    await UpdateCacheAsync(true);
    const t2: number = Date.now();
    OutputChannel.appendLine(`Refresh Resource ${t2 - t1} ms`);
    OutputChannel.show();
}
