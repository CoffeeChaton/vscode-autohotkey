import * as vscode from 'vscode';
import { CAhkFuncSymbol, EStr } from '../../../globalEnum';

export function fnDAList2Completion(
    inputStr: string,
    fileName: string,
    DAList: CAhkFuncSymbol[],
): vscode.CompletionItem[] {
    const need: vscode.CompletionItem[] = [];
    for (const DA of DAList) {
        if (DA.kind !== vscode.SymbolKind.Function) continue;
        const { md, name, selectionRangeText } = DA;

        const label: string = name.startsWith(inputStr) // <----- don't use wm because inputStr
            ? `${EStr.suggestStr} ${name}`
            : name;

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
