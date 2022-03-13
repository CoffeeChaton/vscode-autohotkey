/* eslint-disable no-await-in-loop */
import * as mm from 'micromatch';
import * as vscode from 'vscode';
import { Detecter } from '../../../core/Detecter';
import { EStr, TAhkSymbolList } from '../../../globalEnum';
import { setFuncHoverMD } from '../../../tools/MD/setHoverMD';
import { insertTextWm } from '../classThis/insertTextWm';

export async function listAllFuncClass(
    inputStr: string,
    blockList: readonly string[],
): Promise<vscode.CompletionItem[]> {
    const fsPaths = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        if (mm.isMatch(fsPath, blockList)) continue;

        const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;
        for (const ahkSymbol of AhkSymbolList) {
            if (ahkSymbol.kind === vscode.SymbolKind.Class) {
                const kind = vscode.CompletionItemKind.Class;
                const label = ahkSymbol.name.startsWith(inputStr)
                    ? `${EStr.suggestStr} ${ahkSymbol.name}`
                    : ahkSymbol.name;
                const item = new vscode.CompletionItem(label, kind);
                item.insertText = await insertTextWm({ ahkSymbol, fsPath });
                item.detail = 'neko help';
                item.documentation = 'user def class';
                itemS.push(item);
            } else if (ahkSymbol.kind === vscode.SymbolKind.Function) {
                const kind = vscode.CompletionItemKind.Function;
                const label = ahkSymbol.name.startsWith(inputStr)
                    ? `${EStr.suggestStr} ${ahkSymbol.name}`
                    : ahkSymbol.name;
                const item = new vscode.CompletionItem(label, kind);
                item.insertText = await insertTextWm({ ahkSymbol, fsPath });
                item.detail = 'neko help';
                item.documentation = await setFuncHoverMD({ fsPath, AhkSymbol: ahkSymbol });
                itemS.push(item);
            }
        }
    }
    return itemS;
}
