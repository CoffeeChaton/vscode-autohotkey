/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { kindCheck } from '../Def/kindCheck';
import { EMode } from '../../globalEnum';

async function tryGetSymbol(wordLower: string, mode: EMode): Promise<vscode.CompletionItem[]> {
    const fsPaths = Detecter.getDocMapFile();
    const completion: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        const docSymbolList = Detecter.getDocMap(fsPath);
        if (docSymbolList === undefined) continue;
        const iMax = docSymbolList.length;
        for (let i = 0; i < iMax; i++) {
            if (kindCheck(mode, docSymbolList[i].kind) === true
                && docSymbolList[i].name.toLowerCase().startsWith(wordLower)) {
                const func = docSymbolList[i];
                console.log('&&docSymbolList[i].name.toLowerCase -> symbolOfKind', func);
                const c = new vscode.CompletionItem(func.name, vscode.CompletionItemKind.Function);
                const document = await vscode.workspace.openTextDocument(fsPath);
                c.insertText = new vscode.SnippetString(document.getText(func.selectionRange));
                completion.push(c);
            }
        }
    }
    return completion;
}

export class CompletionItemProvider implements vscode.CompletionItemProvider {
    public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
        token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<vscode.CompletionItem[] | null> {
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return null;
        const fsPathList = Detecter.getDocMapFile();
        const wordLower = document.getText(Range).toLowerCase();
        const FuncSymbol = await tryGetSymbol(wordLower, EMode.ahkFunc);
        if (FuncSymbol) {
            return FuncSymbol;
        }

        const textRaw = document.lineAt(position).text;

        return null;
    }
}
