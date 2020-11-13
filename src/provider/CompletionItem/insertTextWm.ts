/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */

import * as vscode from 'vscode';

import { MyDocSymbol } from '../../globalEnum';

let wm: WeakMap<MyDocSymbol, vscode.SnippetString> = new WeakMap();
let wmSize = 0;
setInterval(() => {
    wm = new WeakMap();
    wmSize = 0;
    console.log('insertTextWm WeakMap clear 10 min');
    // eslint-disable-next-line no-magic-numbers
}, 10 * 60 * 1000); // 10 minute

export async function insertTextWm(AhkSymbol: MyDocSymbol, fsPath: string): Promise<vscode.SnippetString> {
    const cache = wm.get(AhkSymbol);
    if (cache !== undefined) {
        // console.log('WeakMap -> wordLower :', AhkSymbol);
        // console.log('WeakMap -> cache :', cache);
        return cache;
    }

    const document = await vscode.workspace.openTextDocument(fsPath);
    const insertText = new vscode.SnippetString(document.getText(AhkSymbol.selectionRange));

    wm.set(AhkSymbol, insertText);
    wmSize += 1;
    // eslint-disable-next-line no-magic-numbers
    if (wmSize > 3000) {
        wm = new WeakMap();
        wmSize = 0;
        console.log('insertTextWm WeakMap clear of wmSize > 3000');
    }
    return insertText;
}
