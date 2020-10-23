/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */

import * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { kindCheck } from '../Def/kindCheck';
import { EMode, MyDocSymbol } from '../../globalEnum';
import { setFuncHoverMD } from '../../tools/setHoverMD';
import { Pretreatment } from '../../tools/Pretreatment';

async function getItemSOfEMode(wordLower: string, mode: EMode): Promise<vscode.CompletionItem[]> {
    const fsPaths = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        const AhkSymbolList = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;
        for (const AhkSymbol of AhkSymbolList) {
            if (kindCheck(mode, AhkSymbol.kind)
                && AhkSymbol.name.toLowerCase().startsWith(wordLower)) {
                const item = new vscode.CompletionItem(AhkSymbol.name, vscode.CompletionItemKind.Function);
                const document = await vscode.workspace.openTextDocument(fsPath);
                item.insertText = new vscode.SnippetString(document.getText(AhkSymbol.selectionRange));
                item.detail = 'neko help';
                const tempName = { fsPath, AhkSymbol };
                item.documentation = await setFuncHoverMD(tempName);
                itemS.push(item);
            }
        }
    }
    return itemS;
}

function getValList(document: vscode.TextDocument, position: vscode.Position, wordLower: string, ahkSymbol: MyDocSymbol): vscode.CompletionItem[] {
    const { selectionRange } = ahkSymbol;
    const argS = document.getText(selectionRange)
        .replace(/^\w\w*\(/, '')
        .replace(/\)\*s$/, '')
        .split(',')
        .filter((v) => v.trim().toLowerCase().startsWith(wordLower))
        .map((v) => v.replace(/:=.*/, '').trim());

    const argItemS = argS.map((v) => {
        const item = new vscode.CompletionItem(v, vscode.CompletionItemKind.Variable);
        item.detail = 'neko help';
        item.documentation = new vscode.MarkdownString(`${ahkSymbol.name} arg`, true);
        return item;
    });

    const bodyRange = new vscode.Range(selectionRange.end, position);
    const DocStrMap = Pretreatment(document.getText(bodyRange).split('\n'));

    return argItemS;
}

function getValInFunc(document: vscode.TextDocument, position: vscode.Position, wordLower: string): vscode.CompletionItem[] {
    const ahkSymbolS = Detecter.getDocMap(document.uri.fsPath);
    if (ahkSymbolS === undefined) return [];

    for (const ahkSymbol of ahkSymbolS) {
        if (kindCheck(EMode.ahkFunc, ahkSymbol.kind)
            && ahkSymbol.range.contains(position)) {
            return getValList(document, position, wordLower, ahkSymbol); // only 1,so use return;
        }
    }
    return [];
}

export class CompletionItemProvider implements vscode.CompletionItemProvider {
    public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position,
        token: vscode.CancellationToken, context: vscode.CompletionContext): Promise<null | vscode.CompletionItem[]> {
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return null;
        //   const fsPathList = Detecter.getDocMapFile();
        const wordLower = document.getText(Range).toLowerCase();
        const funcNameList = await getItemSOfEMode(wordLower, EMode.ahkFunc);
        const classNameList = await getItemSOfEMode(wordLower, EMode.ahkClass);
        const valInFuncList = getValInFunc(document, position, wordLower);
        return [...funcNameList, ...classNameList, ...valInFuncList];
    }
}
