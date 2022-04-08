import * as vscode from 'vscode';
import { EStr } from '../../../globalEnum';
import { TDAMeta } from '../../../tools/DeepAnalysis/TypeFnMeta';

export function fnDAList2Completion(inputStr: string, fileName: string, DAList: TDAMeta[]): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    for (const DA of DAList) {
        if (DA.kind !== vscode.SymbolKind.Function) continue;
        const { md, funcRawName, selectionRangeText } = DA;

        const label: string = funcRawName.startsWith(inputStr) // <----- don't use wm because inputStr
            ? `${EStr.suggestStr} ${funcRawName}`
            : funcRawName;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label,
            description: fileName,
        });

        item.insertText = selectionRangeText;
        item.detail = 'neko help';

        item.kind = vscode.CompletionItemKind.Function;
        item.documentation = md;

        need.push(item);
    }
    return need;
}
