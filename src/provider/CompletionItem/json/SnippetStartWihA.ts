import * as vscode from 'vscode';
import { ETime } from '../../../globalEnum';
import { A_Variables } from '../../../tools/Built-in/Variables';

const snippetList: vscode.CompletionItem[] = [];

export function snippetStartWihA(): vscode.CompletionItem[] {
    // normal
    if (snippetList.length > 0) return snippetList;
    // First loading
    for (const [k, v] of Object.entries(A_Variables)) {
        const label: vscode.CompletionItemLabel = {
            label: k, // Left
            //  detail: v.class, // mid
            description: v.class, // Right
        };
        const item = new vscode.CompletionItem(label);
        // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.kind = vscode.CompletionItemKind.Variable;
        item.insertText = k;
        // item.filterText = 'A_';
        item.detail = 'Built-in Variables (neko-help)'; // description
        item.documentation = new vscode.MarkdownString('', true)
            .appendCodeblock(k, 'ahk')
            .appendMarkdown(v.class)
            .appendMarkdown('\n\n')
            .appendMarkdown(`[Read Doc](${v.uri})`);
        snippetList.push(item);
    }
    Object.freeze(snippetList);
    return snippetList;
}

// Delay loading
setTimeout(snippetStartWihA, ETime.SnippetStartWihA);
