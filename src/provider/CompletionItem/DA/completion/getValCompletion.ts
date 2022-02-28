import * as vscode from 'vscode';
import {
    TSnippetRecMap,
    TValMap,
} from '../../../../globalEnum';
import { setItemCore } from './setItem';

export function getValCompletion(
    valMap: TValMap,
    funcName: string,
    recMap: TSnippetRecMap,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    valMap.forEach((v) => {
        const { keyRawName, refLoc, defLoc } = v;
        const item: vscode.CompletionItem = setItemCore({
            prefix: 'var',
            recMap,
            keyRawName,
            funcName,
            refLoc,
            defLoc,
            kind: vscode.CompletionItemKind.Variable,
        });
        need.push(item);
    });

    return need;
}
