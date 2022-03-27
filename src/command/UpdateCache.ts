import * as vscode from 'vscode';
import { BaseScanCache } from '../core/BaseScanCache/cache';
import { Detecter, TUpdateDocDefReturn } from '../core/Detecter';
import { globalValMap } from '../core/Global';
import { getUriList } from '../tools/fsTools/getUriList';

export type TDocFullData = {
    nekoData: TUpdateDocDefReturn;
    vscDoc: vscode.TextDocument;
};
export type TUpdateCacheAsyncReturn = {
    timeSpend: number;
    DocFullData: TDocFullData[];
};

export async function UpdateCacheAsync(): Promise<null | TUpdateCacheAsyncReturn> {
    const timeStart: number = Date.now();

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

    const DocFullData: TDocFullData[] = await Promise.all(waitDocFullData);

    const timeSpend: number = Date.now() - timeStart;

    return {
        timeSpend,
        DocFullData,
    };
}
// TODO detail: string -> Enum
// kind: vscode.SymbolKind; -> myEnum
