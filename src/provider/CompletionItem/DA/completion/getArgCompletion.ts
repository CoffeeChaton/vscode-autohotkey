import * as vscode from 'vscode';
import {
    TArgAnalysis,
    TArgMap,
    TSnippetRecMap,
} from '../../../../globalEnum';
import { setPreFix } from '../../../../tools/str/setPreFix';
import { setItemCore } from './setItem';

export function getParamCompletion(
    argMap: TArgMap,
    funcName: string,
    recMap: TSnippetRecMap,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    argMap.forEach((v: TArgAnalysis): void => {
        // dprint-ignore
        const {
            keyRawName, refRangeList, defRangeList, isByRef, isVariadic,
        } = v;
        const item: vscode.CompletionItem = setItemCore({
            prefix: setPreFix(isByRef, isVariadic),
            recMap,
            keyRawName,
            funcName,
            refRangeList,
            defRangeList,
            kind: vscode.CompletionItemKind.Variable,
        });
        need.push(item);
    });

    return need;
}
