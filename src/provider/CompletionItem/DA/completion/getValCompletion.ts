import * as vscode from 'vscode';
import { TValMapOut, TValMetaOut } from '../../../../AhkSymbol/CAhkFunc';
import { EPrefix } from '../../../../tools/MD/setMD';
import { TSnippetRecMap } from '../ESnippetRecBecause';
import { setItemCore } from './setItem';

export function getValCompletion(
    valMap: TValMapOut,
    funcName: string,
    recMap: TSnippetRecMap,
): vscode.CompletionItem[] {
    return [...valMap.values()].map((v: TValMetaOut): vscode.CompletionItem => {
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
        return item;
    });
}
