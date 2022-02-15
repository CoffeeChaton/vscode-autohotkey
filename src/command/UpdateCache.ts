import * as vscode from 'vscode';
import { buildByPath, buildByPathAsync, Detecter } from '../core/Detecter';

const getWorkspaceFolders = (): readonly vscode.WorkspaceFolder[] | null => {
    const ahkRootPath = vscode.workspace.workspaceFolders;
    if (ahkRootPath === undefined) {
        vscode.window.showInformationMessage(
            'pleas using workspaces! \nhttps://code.visualstudio.com/docs/editor/workspaces',
        );
        return null;
    }
    return ahkRootPath;
};

export async function UpdateCacheAsync(showMsg: boolean): Promise<null> {
    const timeStart = Date.now();

    const ahkRootPath = getWorkspaceFolders();
    if (ahkRootPath === null) return null;
    Detecter.DocMap.clear();

    const results: Promise<void>[] = [];
    ahkRootPath.forEach((folder) => results.push(buildByPathAsync(showMsg, folder.uri.fsPath)));
    await Promise.all(results);

    if (showMsg) {
        const timeEnd = Date.now() - timeStart;
        const msg = `Update docFuncMap cash (${timeEnd}ms)`;
        console.log(msg);
        vscode.window.showInformationMessage(msg);
    }
    return null;
}

export function UpdateCache(): null {
    const ahkRootPath = getWorkspaceFolders();
    if (ahkRootPath === null) return null;
    Detecter.DocMap.clear();

    ahkRootPath.forEach((folder): void => buildByPath(folder.uri.fsPath));
    return null;
}
