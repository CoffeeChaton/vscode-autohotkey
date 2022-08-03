import * as path from 'node:path';
import * as vscode from 'vscode';
import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../../AhkSymbol/TAhkSymbolIn';
import { getSnippetBlockFilesList } from '../../../configUI';
import { pm } from '../../../core/ProjectManager';
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

const wm = new WeakMap<TAstRoot, readonly vscode.CompletionItem[]>();

function partSnip(AstRoot: TAstRoot, fileName: string): readonly vscode.CompletionItem[] {
    const cache: readonly vscode.CompletionItem[] | undefined = wm.get(AstRoot);
    if (cache !== undefined) {
        return cache;
    }

    const item: vscode.CompletionItem[] = [];
    for (const AH of AstRoot) {
        if (AH instanceof CAhkClass) {
            // is Class
            item.push(setClassSnip(fileName, AH));
        } else if (AH instanceof CAhkFunc) {
            // is Func
            item.push(setFuncSnip(fileName, AH));
        }
    }

    wm.set(AstRoot, item);
    return item;
}

export function listAllFuncClass(): vscode.CompletionItem[] {
    const filesBlockList: readonly RegExp[] = getSnippetBlockFilesList();

    const item: vscode.CompletionItem[] = [];
    for (const { uri, AST } of pm.DocMap.values()) { // keep output order is OK
        if (!fsPathIsAllow(uri.fsPath.replaceAll('\\', '/'), filesBlockList)) continue;

        item.push(...partSnip(AST, path.basename(uri.fsPath)));
    }
    return item;
}
