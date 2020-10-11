/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,3] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';

function clearOutlineCache(): null {
    const ahkRootPath = vscode.workspace.rootPath;
    if (ahkRootPath === undefined) {
        vscode.window.showInformationMessage('vscode.workspace.rootPath is undefined');
        return null;
    }
    Detecter.DocMap.clear();
    Detecter.buildByPath(ahkRootPath);
    vscode.window.showInformationMessage('Update docFuncMap cash');
    return null;
}
async function listAhkInclude(): Promise<null> {
    const fsPathList = Detecter.getDocMapFile();
    const RegexInclude = /^\s*#Include(?:Again)?\s\s*/i;
    let AllList = '';
    for (const fsPath of fsPathList) {
        // eslint-disable-next-line no-await-in-loop
        const document = await vscode.workspace.openTextDocument(fsPath);
        const docAllText = document.getText().split('\n');
        const lineCount = docAllText.length;
        const InitialDescription = `${fsPath}\n`;
        let thisFileDescription = InitialDescription;
        for (let line = 0; line < lineCount; line++) {
            if (RegexInclude.test(docAllText[line])) {
                const lineToFix = (line + 1).toString().padStart(3, ' ');
                thisFileDescription = `${thisFileDescription}${lineToFix} line    ${docAllText[line].trim()}\n`;
            }
        }
        if (thisFileDescription !== InitialDescription) {
            AllList = `${AllList}\n\n${thisFileDescription}`;
        }
    }
    const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');
    OutputChannel.append(AllList);
    OutputChannel.show();
    return null;
}
export async function statusBarClick(): Promise<null> {
    const items: string[] = ['1 -> clearOutlineCache', '2 -> list #Include'];
    const options = await vscode.window.showQuickPick(items);
    switch (options) {
        case '': return null;
        case items[0]: return clearOutlineCache();
        case items[1]: return listAhkInclude();
        default: return null;
    }
}
// const uri = vscode.Uri.parse('https://github.com/CoffeeChaton/vscode-ahk-outline');
// vscode.env.openExternal(uri);
