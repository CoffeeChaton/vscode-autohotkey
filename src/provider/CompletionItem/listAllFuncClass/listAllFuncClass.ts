import * as mm from 'micromatch';
import * as path from 'path';
import * as vscode from 'vscode';
import { Detecter } from '../../../core/Detecter';
import { EStr, TAhkSymbolList } from '../../../globalEnum';
import { getFuncDocMD } from '../../../tools/MD/getFuncDocMD';
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

        const AhkSymbolList: undefined | TAhkSymbolList = Detecter.getDocMap(fsPath)?.AhkSymbolList;
        if (AhkSymbolList === undefined) continue;
        // eslint-disable-next-line no-await-in-loop
        const document: vscode.TextDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
        const fileName = path.basename(fsPath);
        for (const AhkSymbol of AhkSymbolList) {
            if (AhkSymbol.kind === vscode.SymbolKind.Class) {
                const { name } = AhkSymbol;
                const item = new vscode.CompletionItem({
                    label: getLabel(name, inputStr),
                    description: fileName,
                }, vscode.CompletionItemKind.Class);
                item.insertText = insertTextWm(document, AhkSymbol);
                item.detail = 'neko help';
                item.documentation = 'user def class';
                itemS.push(item);
            } else if (AhkSymbol.kind === vscode.SymbolKind.Function) {
                const { name } = AhkSymbol;
                const item = new vscode.CompletionItem({
                    label: getLabel(name, inputStr),
                    description: fileName,
                }, vscode.CompletionItemKind.Function);
                item.insertText = insertTextWm(document, AhkSymbol);
                item.detail = 'neko help';
                item.documentation = getFuncDocMD(AhkSymbol, fsPath, document);
                itemS.push(item);
            }
        }
    }
    return itemS;
}
