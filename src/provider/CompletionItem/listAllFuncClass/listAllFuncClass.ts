/* eslint-disable no-await-in-loop */
import * as mm from 'micromatch';
import * as path from 'path';
import * as vscode from 'vscode';
import { Detecter } from '../../../core/Detecter';
import { EStr, TAhkSymbol, TAhkSymbolList } from '../../../globalEnum';
import { getFuncDocMD } from '../../../tools/MD/getFuncDocMD';
import { insertTextWm } from '../classThis/insertTextWm';

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
    inputStr: string,
    blockList: readonly string[],
): Promise<vscode.CompletionItem[]> {
    const fsPaths: string[] = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        if (mm.isMatch(fsPath, blockList)) continue;

        const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList === undefined) continue;

        // always need IO <-> const document = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
        const fileName: string = path.basename(fsPath);
        for (const AhkSymbol of AhkSymbolList) {
            if (AhkSymbol.kind === vscode.SymbolKind.Class) {
                const item: vscode.CompletionItem = await setLabel(inputStr, fileName, fsPath, AhkSymbol);
                item.kind = vscode.CompletionItemKind.Class;
                item.documentation = 'user def class';
                itemS.push(item);
            } else if (AhkSymbol.kind === vscode.SymbolKind.Function) {
                const item: vscode.CompletionItem = await setLabel(inputStr, fileName, fsPath, AhkSymbol);
                item.kind = vscode.CompletionItemKind.Function;
                item.documentation = await getFuncDocMD(AhkSymbol, fsPath); // 90% not need IO // have weakMap to memo
                itemS.push(item);
            }
        }
    }
    return itemS;
}
