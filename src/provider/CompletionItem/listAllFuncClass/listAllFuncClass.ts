/* eslint-disable no-await-in-loop */
import * as vscode from 'vscode';
import { Detecter } from '../../../core/Detecter';
import { EStr } from '../../../globalEnum';
import { pathIgnore } from '../../../tools/fsTools/pathIgnore';
import { setFuncHoverMD } from '../../../tools/MD/setHoverMD';
import { insertTextWm } from '../classThis/insertTextWm';

async function listAllFuncClass(inputStr: string): Promise<vscode.CompletionItem[]> {
    const fsPaths = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        if (pathIgnore(fsPath)) continue;

        const AhkSymbolList = Detecter.getDocMap(fsPath);
        if (AhkSymbolList === null) continue;
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

export async function wrapListAllFuncClass(
    document: vscode.TextDocument,
    position: vscode.Position,
    inputStr: string,
): Promise<vscode.CompletionItem[]> {
    // eslint-disable-next-line security/detect-unsafe-regex
    const Range = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
    if (Range === undefined) return []; // exp: . / []

    if (Range.start.character - 1 > -1) {
        const newRange = new vscode.Range(
            Range.start.line,
            Range.start.character - 1,
            Range.start.line,
            Range.start.character,
        );
        const newStr = document.getText(newRange);
        if (newStr !== '.' && newStr !== '`') {
            const need0 = await listAllFuncClass(inputStr);
            return need0;
        }
        return [];
    }
    // at line start
    const ed2 = await listAllFuncClass(inputStr);
    return ed2;
}
