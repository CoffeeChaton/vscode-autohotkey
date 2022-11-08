/* eslint-disable max-len */
/* eslint-disable max-lines */
/* eslint-disable no-template-curly-in-string */
import * as vscode from 'vscode';
import type { TStatementElement } from './statement';
import { Statement } from './statement';

function Statement2Md(element: TStatementElement): vscode.MarkdownString {
    const {
        keyRawName,
        doc,
        link,
        exp,
    } = element;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendCodeblock(keyRawName, 'ahk')
        .appendMarkdown(doc)
        .appendMarkdown('\n')
        .appendMarkdown(`[(Read Doc)](${link})`)
        .appendMarkdown('\n\n***')
        .appendMarkdown('\n\n*exp:*')
        .appendCodeblock(exp.join('\n'), 'ahk');

    md.supportHtml = true;
    return md;
}

type TStatementMDMap = ReadonlyMap<string, vscode.MarkdownString>;
type TSnippetStatement = readonly vscode.CompletionItem[];

export const [StatementMDMap, snippetStatement] = ((): [TStatementMDMap, TSnippetStatement] => {
    const map1: Map<string, vscode.MarkdownString> = new Map<string, vscode.MarkdownString>();
    const List2: vscode.CompletionItem[] = [];
    for (const [k, v] of Object.entries(Statement)) {
        const md: vscode.MarkdownString = Statement2Md(v);
        map1.set(k, md);

        if (!v.recommended) continue;
        const { keyRawName, body } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: keyRawName,
            description: keyRawName,
        });
        item.kind = vscode.CompletionItemKind.Keyword; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = new vscode.SnippetString(body);
        item.detail = 'Statement of AHK (neko-help)'; // description
        item.documentation = md;

        List2.push(item);
    }

    return [map1, List2]; // [Map(19), Array(19)]
})();

export function getSnippetStatement(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A_')
        ? []
        : snippetStatement;
}

export function getHoverStatement(wordUp: string): vscode.MarkdownString | undefined {
    return StatementMDMap.get(wordUp);
}
