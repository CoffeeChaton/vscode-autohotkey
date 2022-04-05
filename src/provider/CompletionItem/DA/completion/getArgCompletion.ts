import * as vscode from 'vscode';
import { TSnippetRecMap } from '../../../../globalEnum';
import { TParamMap, TParamMeta } from '../../../../tools/DeepAnalysis/TypeFnMeta';
import { setPreFix } from '../../../../tools/str/setPreFix';
import { setItemCore } from './setItem';

export function getParamCompletion(
    paramMap: TParamMap,
    funcName: string,
    recMap: TSnippetRecMap,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    paramMap.forEach((v: TParamMeta): void => {
        const {
            keyRawName,
            refRangeList,
            defRangeList,
            isByRef,
            isVariadic,
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
