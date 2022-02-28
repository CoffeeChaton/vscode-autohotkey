import * as vscode from 'vscode';
import { TTextMap } from '../../../../globalEnum';
import { setItemCore } from './setItem';

export function getUnknownTextCompletion(
    textMap: TTextMap,
    funcName: string,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    textMap.forEach((v) => {
        const { keyRawName, refLoc } = v;
        const item: vscode.CompletionItem = setItemCore({
            prefix: 'unknown Text',
            recMap: new Map(),
            keyRawName,
            funcName,
            refLoc,
            defLoc: [],
            kind: vscode.CompletionItemKind.Text,
        });
        need.push(item);
    });

    return need;
}
