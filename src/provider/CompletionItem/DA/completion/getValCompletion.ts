import * as vscode from 'vscode';
import {
    TSnippetRecMap,
    TValMap,
} from '../../../../globalEnum';
import { EPrefix } from '../../../../tools/MD/setMD';
import { setItemCore } from './setItem';

export function getValCompletion(
    valMap: TValMap,
    funcName: string,
    recMap: TSnippetRecMap,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    valMap.forEach((v) => {
        const {
            keyRawName,
            refRangeList,
            defRangeList,
            // ahkValType,
        } = v;
        // const typeValType = getAhkTypeName(ahkValType);
        const item: vscode.CompletionItem = setItemCore({
            prefix: EPrefix.var,
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
