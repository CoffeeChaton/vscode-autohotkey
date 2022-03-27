import * as vscode from 'vscode';
import { BaseScanCache } from '../core/BaseScanCache/cache';
import { Detecter, TUpdateDocDefReturn } from '../core/Detecter';
import { globalValMap } from '../core/Global';
import { getUriList } from '../tools/fsTools/getUriList';

type TDocFullData = {
    nekoData: TUpdateDocDefReturn;
    vscDoc: vscode.TextDocument;
};
type TUpdateCacheAsyncReturn = {
    timeSpend: number;
    DocFullData: TDocFullData[];
};

export async function UpdateCacheAsync(showMsg: boolean): Promise<null | TUpdateCacheAsyncReturn> {
    const timeStart = Date.now();

    Detecter.DocMap.clear();
    globalValMap.clear();
    BaseScanCache.cache.clear();

    const uriList: vscode.Uri[] | null = getUriList();
    if (uriList === null) return null;

    const waitDocFullData: Thenable<TDocFullData>[] = [];
    for (const uri of uriList) {
        waitDocFullData.push(
            vscode.workspace
                .openTextDocument(uri)
                .then((doc: vscode.TextDocument): TDocFullData => ({
                    vscDoc: doc,
                    nekoData: Detecter.updateDocDef(doc),
                })),
        );
    }
    const DocFullData = await Promise.all(waitDocFullData);

    const timeSpend = Date.now() - timeStart;
    if (showMsg) {
        const msg = `Update docFuncMap cash (${timeSpend}ms)`;
        console.log(msg);
        void vscode.window.showInformationMessage(msg);
    }
    return {
        timeSpend,
        DocFullData,
    };
}
// TODO detail: string -> Enum
// kind: vscode.SymbolKind; -> myEnum
