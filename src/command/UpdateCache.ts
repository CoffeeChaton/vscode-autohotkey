import * as vscode from 'vscode';
import { BaseScanCache } from '../core/BaseScanCache/cache';
import { Detecter, TUpdateDocDefReturn } from '../core/Detecter';
import { globalValMap } from '../core/Global';
import { getUriList } from '../tools/fsTools/getUriList';

export async function UpdateCacheAsync(showMsg: boolean): Promise<null> {
    const timeStart = Date.now();

    Detecter.DocMap.clear();
    globalValMap.clear();
    BaseScanCache.cache.clear();

    const uriList: vscode.Uri[] | null = getUriList();
    if (uriList === null) return null;

    const results: Promise<TUpdateDocDefReturn>[] = [];
    for (const uri of uriList) {
        results.push(Detecter.updateDocDef(uri));
    }
    await Promise.all(results);

    if (showMsg) {
        const timeEnd = Date.now() - timeStart;
        const msg = `Update docFuncMap cash (${timeEnd}ms)`;
        console.log(msg);
        void vscode.window.showInformationMessage(msg);
    }
    return null;
}
