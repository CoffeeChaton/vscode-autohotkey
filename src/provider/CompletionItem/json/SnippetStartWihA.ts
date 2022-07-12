import * as vscode from 'vscode';
import { A_Variables, A_Variables2Md, A_VariablesMDMap } from '../../../tools/Built-in/Variables';

const snippetStartWihA: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const tempList: vscode.CompletionItem[] = [];
    for (const [k, v] of Object.entries(A_Variables)) {
        const label: vscode.CompletionItemLabel = {
            label: k, // Left
            description: v.group, // Right
        };
        const item = new vscode.CompletionItem(label);
        // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.kind = vscode.CompletionItemKind.Variable;
        item.insertText = k;
        // item.filterText = 'A_';
        item.detail = 'Built-in Variables (neko-help)'; // description
        item.documentation = A_VariablesMDMap.get(k.toUpperCase()) ?? A_Variables2Md(v);
    }
    return tempList;
})();

export function getSnippetStartWihA(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A')
        ? snippetStartWihA
        : [];
}
// // Delay loading
// setTimeout(snippetStartWihA, ETime.SnippetStartWihA);
