/* eslint-disable no-await-in-loop */

import * as vscode from 'vscode';
import { MyDocSymbol, TSymAndFsPath } from '../../globalEnum';
import { ClassWm } from '../../tools/wm';

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<MyDocSymbol, vscode.SnippetString>(10 * 60 * 1000, 'insertTextWm', 3000);

export async function insertTextWm(c0: TSymAndFsPath): Promise<vscode.SnippetString> {
    const { ahkSymbol, fsPath } = c0;
    const cache = w.getWm(ahkSymbol);
    if (cache) return cache;

    const document = await vscode.workspace.openTextDocument(fsPath);
    const insertText = new vscode.SnippetString(document.getText(ahkSymbol.selectionRange));

    return w.setWm(ahkSymbol, insertText);
}
