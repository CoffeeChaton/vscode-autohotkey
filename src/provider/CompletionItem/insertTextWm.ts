/* eslint-disable no-magic-numbers */
/* eslint-disable no-await-in-loop */

import * as vscode from 'vscode';
import { TAhkSymbol, TSymAndFsPath } from '../../globalEnum';
import { ClassWm } from '../../tools/wm';

const w = new ClassWm<TAhkSymbol, vscode.SnippetString>(10 * 60 * 1000, 'insertTextWm', 3000);

export async function insertTextWm(c0: TSymAndFsPath): Promise<vscode.SnippetString> {
    const { ahkSymbol, fsPath } = c0;
    const cache = w.getWm(ahkSymbol);
    if (cache) return cache;

    const document = await vscode.workspace.openTextDocument(fsPath);
    const insertText = new vscode.SnippetString(document.getText(ahkSymbol.selectionRange));

    return w.setWm(ahkSymbol, insertText);
}
