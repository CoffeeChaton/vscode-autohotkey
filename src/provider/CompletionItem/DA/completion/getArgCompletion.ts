import * as vscode from 'vscode';
import { TParamMapOut, TParamMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { setPreFix } from '../../../../tools/str/setPreFix';
import { TSnippetRecMap } from '../ESnippetRecBecause';
import { setItemCore } from './setItem';

export function getParamCompletion(
    paramMap: TParamMapOut,
    funcName: string,
    recMap: TSnippetRecMap,
): vscode.CompletionItem[] {
    return [...paramMap.values()].map((v: TParamMetaOut): vscode.CompletionItem => {
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
        return item;
    });
}
