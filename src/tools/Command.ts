/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,300] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';
import { removeParentheses } from './removeParentheses';

async function clearOutlineCache(isTest: boolean): Promise<null> {
    const timeStart = Date.now();
    const ahkRootPath = vscode.workspace.workspaceFolders;
    if (ahkRootPath === undefined) {
        vscode.window.showInformationMessage('vscode.workspace.rootPath is undefined');
        return null;
    }
    Detecter.DocMap.clear();
    await Detecter.buildByPathAsync(isTest, ahkRootPath[0].uri.fsPath);
    if (!isTest) {
        const timeEnd = Date.now() - timeStart;
        vscode.window.showInformationMessage(`Update docFuncMap cash (${timeEnd}ms)`);
    }
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

function LoopOfClearOutlineCache(): null {
    vscode.window.showInformationMessage('this is Dev function ,open profile-flame to get .cpuprofile');
    setInterval(() => {
        clearOutlineCache(true);
    }, 300);
    return null;
}
function removeParenthesesTest(): null {
    const d = removeParentheses(listAhkInclude.toString());
    console.log(d);
    return null;
}
export async function statusBarClick(): Promise<null> {
    const items: string[] = [
        '0 -> clearOutlineCache',
        '1 -> list #Include',
        // '2 -> dev tools setInterval() ',
        // '3 -> dev tools test removeParentheses',
    ];
    const options = await vscode.window.showQuickPick(items);
    switch (options) {
        case items[0]: return clearOutlineCache(false);
        case items[1]: return listAhkInclude();
        case items[2]: return LoopOfClearOutlineCache();
        case items[3]: return removeParenthesesTest();
        default: return null;
    }
}
// const uri = vscode.Uri.parse('https://github.com/CoffeeChaton/vscode-ahk-outline');
// vscode.env.openExternal(uri);
