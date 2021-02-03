/* eslint-disable init-declarations */
/* eslint-disable no-await-in-loop */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,5,6,60,100,300,1000] }] */
import * as vscode from 'vscode';
import { Detecter } from '../core/Detecter';

async function clearOutlineCache(isTest: boolean): Promise<null> {
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
        console.log(`Update docFuncMap cash (${timeEnd}ms)`);
    }
    return null;
}

async function listAhkInclude(): Promise<null> {
    const fsPathList = Detecter.getDocMapFile();
    const RegexInclude = /^\s*#Include(?:Again)?\s\s*/i;
    let AllList = '';
    for (const fsPath of fsPathList) {
        const document = await vscode.workspace.openTextDocument(fsPath);
        const docAllText = document.getText().split('\n');
        const lineCount = docAllText.length;
        let thisFileDescription = '';
        for (let line = 0; line < lineCount; line++) {
            if (RegexInclude.test(docAllText[line])) {
                const lineToFix = (line + 1).toString().padStart(3, ' ');
                thisFileDescription = `${thisFileDescription}${lineToFix} line    ${docAllText[line].trim()}\n`;
            }
        }
        if (thisFileDescription !== '') {
            AllList = `${AllList}\n\n${fsPath}\n${thisFileDescription}`;
        }
    }
    const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help');
    OutputChannel.append(AllList);
    OutputChannel.show();
    return null;
}

let c0: NodeJS.Timeout;
let c1: NodeJS.Timeout[] = [];
async function LoopOfClearOutlineCache(): Promise<null> {
    vscode.window.showInformationMessage('this is Dev function ,open profile-flame to get .cpuprofile');
    if (c0) clearInterval(c0);
    c1.forEach((e) => clearInterval(e));
    c1 = [];
    const items: string[] = [
        'just clear NodeJS.Timeout',
        '0 -> Unlimited',
        '1 min',
        '5 min',
    ];
    const base = 300;
    let iMax = 0;
    const maxTime = await vscode.window.showQuickPick(items);
    switch (maxTime) {
        case items[0]: return null;
        case items[1]:
            c0 = setInterval(() => {
                clearOutlineCache(true);
            }, base);
            return null;
        case items[2]:
            iMax = (1 * 60 * 1000) / base;
            break;
        case items[3]:
            iMax = (5 * 60 * 1000) / base;
            break;
        default: return null;
    }
    for (let i = 1; i <= iMax; i++) {
        c1.push(setTimeout(() => {
            clearOutlineCache(true);
        }, i * base));
    }
    return null;
}
export async function statusBarClick(): Promise<null> {
    const items: string[] = [
        '0 -> clearOutlineCache',
        '1 -> list #Include',
        '2 -> dev tools setInterval() ',
        //  '3 -> regTest',
    ];
    const options = await vscode.window.showQuickPick(items);
    switch (options) {
        case items[0]: return clearOutlineCache(false);
        case items[1]: return listAhkInclude();
        case items[2]: return LoopOfClearOutlineCache();
        //  case items[3]: return regTest();
        default: return null;
    }
}
// const uri = vscode.Uri.parse('https://github.com/CoffeeChaton/vscode-ahk-outline');
// vscode.env.openExternal(uri);
