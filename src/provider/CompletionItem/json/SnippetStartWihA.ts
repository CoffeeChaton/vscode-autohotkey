import * as vscode from 'vscode';
import { A_Variables } from '../../../tools/Built-in/Variables';

export const snippetStartWihA: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const tempList: vscode.CompletionItem[] = [];
    for (const [k, v] of Object.entries(A_Variables)) {
        const label: vscode.CompletionItemLabel = {
            label: k, // Left
            //  detail: '', // mid
            description: v.group, // Right
        };
        const item = new vscode.CompletionItem(label);
        // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.kind = vscode.CompletionItemKind.Variable;
        item.insertText = k;
        // item.filterText = 'A_';
        item.detail = 'Built-in Variables (neko-help)'; // description
        item.documentation = new vscode.MarkdownString('', true)
            .appendCodeblock(k, 'ahk')
            .appendMarkdown(v.group)
            .appendMarkdown('\n\n')
            .appendMarkdown(`[Read Doc](${v.uri})`);
        tempList.push(item);
    }
    return tempList;
})();

// // Delay loading
// setTimeout(snippetStartWihA, ETime.SnippetStartWihA);
