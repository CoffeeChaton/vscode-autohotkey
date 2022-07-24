/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines */
/* eslint-disable max-len */
import * as vscode from 'vscode';
import type { TA_VarEleMent } from './A_Variables_Data';
import { A_Variables } from './A_Variables_Data';

function A_Variables2Md(DirectivesElement: TA_VarEleMent): vscode.MarkdownString {
    const {
        body,
        uri,
        group,
    } = DirectivesElement;
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendCodeblock(body, 'ahk')
        .appendMarkdown(group)
        .appendMarkdown('\n\n')
        .appendMarkdown(`[Read Doc](${uri})`);
    md.supportHtml = true;
    return md;
}

const A_VariablesMDMap: ReadonlyMap<string, vscode.MarkdownString> = new Map(
    [...Object.entries(A_Variables)]
        .map(([ukName, BiFunc]) => [ukName.toUpperCase(), A_Variables2Md(BiFunc)]),
);

const snippetStartWihA: readonly vscode.CompletionItem[] = ((): vscode.CompletionItem[] => {
    const tempList: vscode.CompletionItem[] = [];
    for (const [k, v] of Object.entries(A_Variables)) {
        const item = new vscode.CompletionItem({
            label: k, // Left
            description: v.group, // Right
        });
        item.kind = vscode.CompletionItemKind.Variable; // icon of https://code.visualstudio.com/docs/editor/intellisense#_types-of-completions
        item.insertText = k;
        item.detail = 'Built-in Variables (neko-help)';
        item.documentation = A_VariablesMDMap.get(k.toUpperCase()) ?? A_Variables2Md(v);
    }
    return tempList;
})();

export function getSnippetStartWihA(PartStr: string): readonly vscode.CompletionItem[] {
    return PartStr.startsWith('A')
        ? snippetStartWihA
        : [];
}
