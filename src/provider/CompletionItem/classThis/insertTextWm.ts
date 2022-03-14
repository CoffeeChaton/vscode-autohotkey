import * as vscode from 'vscode';
import { TAhkSymbol } from '../../../globalEnum';
import { ClassWm } from '../../../tools/wm';

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<TAhkSymbol, vscode.SnippetString>(10 * 60 * 1000, 'insertTextWm', 3000);

export async function insertTextWm(
    fsPath: string,
    AhkSymbol: TAhkSymbol,
): Promise<vscode.SnippetString> {
    const cache = w.getWm(AhkSymbol);
    if (cache) return cache;

    const document = await vscode.workspace.openTextDocument(fsPath);
    const insertText = new vscode.SnippetString(document.getText(AhkSymbol.selectionRange));

    return w.setWm(AhkSymbol, insertText);
}
