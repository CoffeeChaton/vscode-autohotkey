/* eslint-disable no-await-in-loop */

import * as vscode from 'vscode';
import { MyDocSymbol } from '../../globalEnum';
import { ClassWm } from '../../tools/wm';

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<MyDocSymbol, vscode.SnippetString>(10 * 60 * 1000, 'insertTextWm', 3000);

export async function insertTextWm(AhkSymbol: MyDocSymbol, fsPath: string): Promise<vscode.SnippetString> {
    const cache = w.getWm(AhkSymbol);
    if (cache) return cache;

    const document = await vscode.workspace.openTextDocument(fsPath);
    const insertText = new vscode.SnippetString(document.getText(AhkSymbol.selectionRange));

    return w.setWm(AhkSymbol, insertText);
}
