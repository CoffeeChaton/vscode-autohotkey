import * as vscode from 'vscode';
import { EStr } from '../../../../Enum/EStr';
import { EPrefix, setMD } from '../../../../tools/MD/setMD';
import { ESnippetRecBecause, TSnippetRecMap } from '../ESnippetRecBecause';

type TSetItem = {
    prefix: EPrefix;
    recMap: TSnippetRecMap;
    keyRawName: string;
    funcName: string;
    refRangeList: readonly vscode.Range[];
    defRangeList: readonly vscode.Range[];
    kind: vscode.CompletionItemKind;
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
    }: TSetItem,
): vscode.CompletionItem {
    const recStr: ESnippetRecBecause | undefined = recMap.get(keyRawName);

    const label: vscode.CompletionItemLabel = {
        label: recStr
            ? `${EStr.suggestStr} ${keyRawName}`
            : keyRawName,
        description: funcName,
    };

    const item: vscode.CompletionItem = new vscode.CompletionItem(label);
    item.kind = kind; // vscode.CompletionItemKind.Variable;
    item.insertText = keyRawName;
    item.detail = `${prefix} (neko-help-DeepAnalysis)`;
    if (recStr !== undefined) {
        item.sortText = String.fromCharCode(0) + String.fromCharCode(1);
        item.preselect = true;
    }

    item.documentation = setMD(prefix, refRangeList, defRangeList, funcName, recStr ?? '');
    return item;
}
