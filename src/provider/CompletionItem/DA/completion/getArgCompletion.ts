import * as vscode from 'vscode';
import { TParamMapOut, TParamMetaOut, TSnippetRecMap } from '../../../../globalEnum';
import { setPreFix } from '../../../../tools/str/setPreFix';
import { setItemCore } from './setItem';

export function getParamCompletion(
    paramMap: TParamMapOut,
    funcName: string,
    recMap: TSnippetRecMap,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    paramMap.forEach((v: TParamMetaOut): void => {
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
