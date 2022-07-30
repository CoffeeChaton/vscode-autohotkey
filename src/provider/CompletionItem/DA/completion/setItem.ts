import * as vscode from 'vscode';
import { EStr } from '../../../../Enum/EStr';
import type { EPrefix } from '../../../../tools/MD/setMD';
import { setMD } from '../../../../tools/MD/setMD';
import type { ESnippetRecBecause, TSnippetRecMap } from '../ESnippetRecBecause';

type TSetItem = {
    prefix: EPrefix;
    recMap: TSnippetRecMap;
    keyRawName: string;
    funcName: string;
    refRangeList: readonly vscode.Range[];
    defRangeList: readonly vscode.Range[];
    kind: vscode.CompletionItemKind;
    commentList: readonly string[];
};

export function setItemCore(
    {
        prefix,
        recMap,
        keyRawName,
        funcName,
        refRangeList,
        defRangeList,
        kind,
        commentList,
    }: TSetItem,
): vscode.CompletionItem {
    const recStr: ESnippetRecBecause | undefined = recMap.get(keyRawName);

    const label: vscode.CompletionItemLabel = {
        label: recStr !== undefined
            ? `${EStr.suggestStr} ${keyRawName}`
            : keyRawName,
        description: funcName,
    };

    const item: vscode.CompletionItem = new vscode.CompletionItem(label);
    item.kind = kind; // vscode.CompletionItemKind.Variable;
    item.insertText = keyRawName;
    item.detail = `${prefix} (neko-help-DeepAnalysis)`;

    item.documentation = setMD({
        prefix,
        refRangeList,
        defRangeList,
        funcName,
        recStr: recStr ?? '',
        commentList,
    });

    if (recStr !== undefined) {
        item.preselect = true;
    }

    return item;
}
