/* eslint-disable security/detect-object-injection */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';

export function statusBarClick(): void {
    const ahkRootPath = vscode.workspace.rootPath;
    if (ahkRootPath === undefined) {
        vscode.window.showInformationMessage('vscode.workspace.rootPath is undefined');
        return;
    }
    Detecter.DocMap.clear();
    Detecter.buildByPath(ahkRootPath);
    vscode.window.showInformationMessage('Update docFuncMap cash');
}
