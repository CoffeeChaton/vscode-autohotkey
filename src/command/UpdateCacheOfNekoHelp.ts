import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';

export async function UpdateCacheOfNekoHelp(isTest: boolean): Promise<null> {
    const timeStart = Date.now();
    const ahkRootPath = vscode.workspace.workspaceFolders;
    if (ahkRootPath === undefined) {
        console.log('vscode.workspace.rootPath is undefined');

        return null;
    }
    Detecter.DocMap.clear();
    await Detecter.buildByPathAsync(isTest, ahkRootPath[0].uri.fsPath);
    if (!isTest) {
        const timeEnd = Date.now() - timeStart;
        const msg = `Update docFuncMap cash (${timeEnd}ms)`;
        console.log(msg);
        vscode.window.showInformationMessage(msg);
    }
    return null;
}
