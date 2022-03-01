import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { buildByPath } from '../tools/fsTools/buildByPath';
import { buildByPathAsync } from '../tools/fsTools/buildByPathAsync';
import { getWorkspaceFolders } from '../tools/fsTools/getWorkspaceFolders';

export async function UpdateCacheAsync(showMsg: boolean): Promise<null> {
    const timeStart = Date.now();

    const ahkRootPath = getWorkspaceFolders();
    if (ahkRootPath === null) return null;
    Detecter.DocMap.clear();

    const results: Promise<void>[] = [];
    ahkRootPath.forEach((folder) => results.push(buildByPathAsync(showMsg, folder.uri.fsPath, false)));
    await Promise.all(results);

    if (showMsg) {
        const timeEnd = Date.now() - timeStart;
        const msg = `Update docFuncMap cash (${timeEnd}ms)`;
        console.log(msg);
        void vscode.window.showInformationMessage(msg);
    }
    return null;
}

export function UpdateCache(): null {
    const ahkRootPath = getWorkspaceFolders();
    if (ahkRootPath === null) return null;
    Detecter.DocMap.clear();

    ahkRootPath.forEach((folder): void => buildByPath(folder.uri.fsPath, false));
    return null;
}
