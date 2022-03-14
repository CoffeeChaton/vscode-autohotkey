/* eslint-disable no-await-in-loop */
import * as mm from 'micromatch';
import * as path from 'path';
import * as vscode from 'vscode';
import { Detecter } from '../../../core/Detecter';
import { EStr, TAhkSymbolList } from '../../../globalEnum';
import { setFuncHoverMD } from '../../../tools/MD/setHoverMD';
import { insertTextWm } from '../classThis/insertTextWm';

function getLabel(name: string, inputStr: string): string {
    return name.startsWith(inputStr)
        ? `${EStr.suggestStr} ${name}`
        : name;
}

export async function listAllFuncClass(
    inputStr: string,
    blockList: readonly string[],
): Promise<vscode.CompletionItem[]> {
    const fsPaths = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        if (mm.isMatch(fsPath, blockList)) continue;
        const description = path.basename(fsPath);

        const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === undefined) continue;
        for (const AhkSymbol of AhkSymbolList) {
            if (AhkSymbol.kind === vscode.SymbolKind.Class) {
                const { name } = AhkSymbol;
                const item = new vscode.CompletionItem({
                    label: getLabel(name, inputStr),
                    description,
                }, vscode.CompletionItemKind.Class);
                item.insertText = await insertTextWm({ AhkSymbol, fsPath });
                item.detail = 'neko help';
                item.documentation = 'user def class';
                itemS.push(item);
            } else if (AhkSymbol.kind === vscode.SymbolKind.Function) {
                const { name } = AhkSymbol;
                const item = new vscode.CompletionItem({
                    label: getLabel(name, inputStr),
                    description,
                }, vscode.CompletionItemKind.Function);
                item.insertText = await insertTextWm({ AhkSymbol, fsPath });
                item.detail = 'neko help';
                item.documentation = await setFuncHoverMD({ fsPath, AhkSymbol });
                itemS.push(item);
            }
        }
    }
    return itemS;
}
