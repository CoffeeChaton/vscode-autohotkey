import * as vscode from 'vscode';
import { TTextMap } from '../../../../globalEnum';
import { EPrefix } from '../../../../tools/MD/setMD';
import { setItemCore } from './setItem';

export function getUnknownTextCompletion(
    textMap: TTextMap,
    funcName: string,
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    textMap.forEach((v) => {
        const { keyRawName, refRangeList } = v;
        const item: vscode.CompletionItem = setItemCore({
            prefix: EPrefix.unKnownText,
            recMap: new Map(),
            keyRawName,
            funcName,
            refRangeList,
            defRangeList: [],
            kind: vscode.CompletionItemKind.Text,
        });
        need.push(item);
    });

    return need;
}
