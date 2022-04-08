/* eslint-disable no-await-in-loop */
import * as mm from 'micromatch';
import * as path from 'path';
import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../../core/Detecter';
import { EStr, TAhkSymbol } from '../../../globalEnum';
import { insertTextWm } from '../classThis/insertTextWm';
import { fnDAList2Completion } from './DAList2Completion';

async function setLabel(
    inputStr: string,
    fileName: string,
    fsPath: string,
    AhkSymbol: TAhkSymbol,
): Promise<vscode.CompletionItem> {
    const { name } = AhkSymbol;

    const label: string = name.startsWith(inputStr) // <----- don't use wm because inputStr
        ? `${EStr.suggestStr} ${name}`
        : name;

    const item: vscode.CompletionItem = new vscode.CompletionItem({
        label,
        description: fileName,
    });

    item.insertText = await insertTextWm(fsPath, AhkSymbol); // have weakMap to memo
    item.detail = 'neko help';
    return item;
}

export async function listAllFuncClass(
    inputStr: string, // <------------------------------------ don't use wm because inputStr
    blockList: readonly string[],
): Promise<vscode.CompletionItem[]> {
    const fsPaths: string[] = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        if (mm.isMatch(fsPath, blockList)) continue;

        const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { AhkSymbolList, DAList } = AhkFileData;
        // always need IO <-> const document = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
        const fileName: string = path.basename(fsPath);
        for (const AhkSymbol of AhkSymbolList) {
            if (AhkSymbol.kind === vscode.SymbolKind.Class) {
                const item: vscode.CompletionItem = await setLabel(inputStr, fileName, fsPath, AhkSymbol);
                item.kind = vscode.CompletionItemKind.Class;
                item.documentation = 'user def class';
                itemS.push(item);
            }
        }

        itemS.push(...fnDAList2Completion(inputStr, fileName, DAList));
    }
    return itemS;
}
