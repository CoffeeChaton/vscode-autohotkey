import * as vscode from 'vscode';
import { BaseScanMemo } from '../core/BaseScanMemo/memo';
import { Detecter, TAhkFileData } from '../core/Detecter';
import { getUriList } from '../tools/fsTools/getUriList';

export async function UpdateCacheAsync(clearCache: boolean): Promise<null | TAhkFileData[]> {
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

// TODO detail: string -> Enum
// kind: vscode.SymbolKind; -> myEnum
