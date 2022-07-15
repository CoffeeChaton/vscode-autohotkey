import * as path from 'node:path';
import * as vscode from 'vscode';
import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getSnippetBlockFilesList } from '../../../configUI';
import { Detecter, TAhkFileData } from '../../../core/Detecter';
import { EStr } from '../../../Enum/EStr';
import { fsPathIsAllow } from '../../../tools/fsTools/getUriList';

function setClassSnip(
    inputStr: string,
    fileName: string,
    AC: CAhkClass,
): vscode.CompletionItem {
    const { name, insertText } = AC;

    const label: string = name.startsWith(inputStr) // <----- don't use memo because inputStr
        ? `${EStr.suggestStr} ${name}`
        : name;

    const item: vscode.CompletionItem = new vscode.CompletionItem({
        label,
        description: fileName,
    });

    item.insertText = insertText;
    item.detail = 'neko help';

    item.kind = vscode.CompletionItemKind.Class;
    item.documentation = 'user def class';
    return item;
}

function setFuncSnip(
    inputStr: string,
    fileName: string,
    DA: CAhkFunc,
): vscode.CompletionItem {
    const { md, name, selectionRangeText } = DA;

    const label: string = name.startsWith(inputStr) // <----- don't use memo because inputStr
        ? `${EStr.suggestStr} ${name}`
        : name;

    const item: vscode.CompletionItem = new vscode.CompletionItem({
        label,
        description: fileName,
    });

    item.insertText = selectionRangeText;
    item.detail = 'neko help';

    item.kind = vscode.CompletionItemKind.Function;
    item.documentation = md;
    return item;
}

export function listAllFuncClass(
    inputStr: string, // <------------------------------------ don't use wm because inputStr
): vscode.CompletionItem[] {
    const filesBlockList: readonly RegExp[] = getSnippetBlockFilesList();

    const fsPaths: string[] = Detecter.getDocMapFile();
    const itemS: vscode.CompletionItem[] = [];
    for (const fsPath of fsPaths) {
        if (!fsPathIsAllow(fsPath.replaceAll('\\', '/'), filesBlockList)) continue;

        const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { AhkSymbolList } = AhkFileData;
        const fileName: string = path.basename(fsPath);

        for (const AH of AhkSymbolList) {
            if (AH instanceof CAhkClass) {
                // is Class
                itemS.push(setClassSnip(inputStr, fileName, AH));
            } else if (AH instanceof CAhkFunc && AH.kind === vscode.SymbolKind.Function) {
                // is Func
                itemS.push(setFuncSnip(inputStr, fileName, AH));
            }
        }
    }
    return itemS;
}
