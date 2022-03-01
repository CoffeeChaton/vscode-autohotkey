import * as vscode from 'vscode';
import {
    ESnippetRecBecause,
    EStr,
    TSnippetRecMap,
} from '../../../../globalEnum';
import { setMD } from '../../../../tools/setMD';

type TSetItem = {
    prefix: string;
    recMap: TSnippetRecMap;
    keyRawName: string;
    funcName: string;
    refLocList: vscode.Location[];
    defLocList: vscode.Location[];
    kind: vscode.CompletionItemKind;
};

export function setItemCore(
    {
        prefix,
        recMap,
        keyRawName,
        funcName,
        refLocList,
        defLocList,
        kind,
    }: TSetItem,
): vscode.CompletionItem {
    const recStr: ESnippetRecBecause | null = recMap.get(keyRawName) ?? null;

    const label: vscode.CompletionItemLabel = {
        label: recStr
            ? `${EStr.suggestStr} ${keyRawName}`
            : keyRawName,
        description: funcName,
    };

    const item = new vscode.CompletionItem(label);
    item.kind = kind; // vscode.CompletionItemKind.Variable;
    item.insertText = keyRawName;
    item.detail = `${prefix} (neko-help-DeepAnalysis)`;
    if (recStr) {
        item.sortText = String.fromCharCode(0) + String.fromCharCode(1);
        item.preselect = true;
    }

    const md: vscode.MarkdownString = setMD(prefix, refLocList, defLocList, funcName, recStr);

    item.documentation = md;
    return item;
}
