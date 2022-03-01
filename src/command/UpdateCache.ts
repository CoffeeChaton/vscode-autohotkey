import * as vscode from 'vscode';
import { buildByPath } from '../core/buildByPath';
import { buildByPathAsync } from '../core/buildByPathAsync';
import { Detecter } from '../core/Detecter';
import { getWorkspaceFolders } from '../tools/getWorkspaceFolders';

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
