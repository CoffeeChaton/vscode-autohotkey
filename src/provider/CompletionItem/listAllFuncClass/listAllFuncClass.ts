import * as path from 'node:path';
import * as vscode from 'vscode';
import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { getSnippetBlockFilesList } from '../../../configUI';
import { Detecter } from '../../../core/Detecter';
import { fsPathIsAllow } from '../../../tools/fsTools/getUriList';

function setClassSnip(
    fileName: string,
    AC: CAhkClass,
): vscode.CompletionItem {
    const { name, insertText } = AC;

    const item: vscode.CompletionItem = new vscode.CompletionItem({
        label: `new ${name}`,
        description: fileName,
    });

    item.insertText = `new ${insertText}`;
    item.detail = 'neko help';

    item.kind = vscode.CompletionItemKind.Class;
    item.documentation = 'user def class';
    return item;
}

function setFuncSnip(
    fileName: string,
    func: CAhkFunc,
): vscode.CompletionItem {
    const { md, name, selectionRangeText } = func;

    const item: vscode.CompletionItem = new vscode.CompletionItem({
        label: `${name}()`,
        description: fileName,
    });

    item.insertText = selectionRangeText;
    item.detail = 'neko help';

    item.kind = vscode.CompletionItemKind.Function;
    item.documentation = md;
    return item;
}

const wm = new WeakMap<readonly TTopSymbol[], readonly vscode.CompletionItem[]>();

function partSnip(TopSymbol: readonly TTopSymbol[], fileName: string): readonly vscode.CompletionItem[] {
    const cache: readonly vscode.CompletionItem[] | undefined = wm.get(TopSymbol);
    if (cache !== undefined) {
        return cache;
    }

    const item: vscode.CompletionItem[] = [];
    for (const AH of TopSymbol) {
        if (AH instanceof CAhkClass) {
            // is Class
            item.push(setClassSnip(fileName, AH));
        } else if (AH instanceof CAhkFunc) {
            // is Func
            item.push(setFuncSnip(fileName, AH));
        }
    }

    wm.set(TopSymbol, item);
    return item;
}

export function listAllFuncClass(): vscode.CompletionItem[] {
    const filesBlockList: readonly RegExp[] = getSnippetBlockFilesList();

    const item: vscode.CompletionItem[] = [];
    for (const { uri, AhkSymbolList } of Detecter.DocMap.values()) { // keep output order is OK
        if (!fsPathIsAllow(uri.fsPath.replaceAll('\\', '/'), filesBlockList)) continue;

        item.push(...partSnip(AhkSymbolList, path.basename(uri.fsPath)));
    }
    return item;
}
