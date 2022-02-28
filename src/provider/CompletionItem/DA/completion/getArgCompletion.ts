import * as vscode from 'vscode';
import {
    TArgMap,
    TSnippetRecMap,
} from '../../../../globalEnum';
import { setPreFix } from '../../../../tools/setPreFix';
import { setItemCore } from './setItem';

export function getParamCompletion(
    argMap: TArgMap,
    funcName: string,
    recMap: TSnippetRecMap,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    argMap.forEach((v) => {
        // dprint-ignore
        const {
            keyRawName, refLoc, defLoc, isByRef, isVariadic,
        } = v;
        const item: vscode.CompletionItem = setItemCore({
            prefix: setPreFix(isByRef, isVariadic),
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
