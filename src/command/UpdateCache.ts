import * as vscode from 'vscode';
import { clearBaseScanCache } from '../core/BaseScanCache/cache';
import { Detecter, TUpdateDocDefReturn } from '../core/Detecter';
import { getUriList } from '../tools/fsTools/buildByPath';

export async function UpdateCacheAsync(showMsg: boolean): Promise<null> {
    const timeStart = Date.now();

    Detecter.DocMap.clear();
    clearBaseScanCache();
    const uriList: vscode.Uri[] | null = getUriList();
    if (uriList === null) return null;

    const results: Promise<TUpdateDocDefReturn>[] = [];
    for (const uri of uriList) {
        results.push(Detecter.updateDocDef(false, uri.fsPath));
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
