/* eslint no-magic-numbers: ["error", { "ignore": [0,3] }] */
import * as vscode from 'vscode';
import type { TBuiltInFuncElement } from './func';
import { BuiltInFunctionObj } from './func';

function Bif2Md(element: TBuiltInFuncElement): vscode.MarkdownString {
    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown(`Built-in Function (${element.group})`)
        .appendCodeblock(`${element.keyRawName}()`, 'ahk')
        .appendMarkdown(element.msg)
        .appendMarkdown('\n')
        .appendMarkdown(`[(Read Doc)](${element.link})`)
        .appendMarkdown('\n\n***')
        .appendMarkdown('\n\n*exp:*')
        .appendCodeblock(element.exp.join('\n'));

    md.supportHtml = true;
    return md;
}

const baseGroup = ['COM', 'IL_', 'LV_', 'OBJ', 'SB_', 'TV_', '_'] as const;

type TrGroup = typeof baseGroup[number];

type TSnip = { readonly [k in TrGroup]: readonly vscode.CompletionItem[] };
type TMap = ReadonlyMap<string, vscode.MarkdownString>;

export const [SnippetObj, BuiltInFuncMDMap] = ((): [TSnip, TMap] => {
    // initialize
    type TSnipTemp = { [k in TrGroup]: vscode.CompletionItem[] };

    const Obj1: TSnipTemp = {
        COM: [],
        IL_: [],
        LV_: [],
        OBJ: [],
        SB_: [],
        TV_: [],
        _: [],
    };

    const map2: Map<string, vscode.MarkdownString> = new Map<string, vscode.MarkdownString>();

    for (const [k, v] of Object.entries(BuiltInFunctionObj)) {
        const md: vscode.MarkdownString = Bif2Md(v);
        map2.set(k, md);

        const { keyRawName, group, insert } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `${keyRawName}()`, // Left
            description: group, // Right
        });
        item.kind = vscode.CompletionItemKind.Function;
        item.insertText = new vscode.SnippetString(insert);

        item.detail = 'Built-in Function (neko-help)';
        item.documentation = md;

        const head = k.slice(0, 3);
        const index: TrGroup = baseGroup.find((search: TrGroup) => search === head) ?? '_';
        Obj1[index].push(item);
    }

    return [Obj1, map2];
})();

export function BuiltInFunc2Completion(inputStr: string): readonly vscode.CompletionItem[] {
    if (inputStr.length < 3) {
        const result: vscode.CompletionItem[] = [];
        for (const v of Object.values(SnippetObj)) {
            result.push(...v);
        }
        return result; // all case
    }

    // head.len is 3 !== '_'
    const head: string = inputStr.slice(0, 3).toUpperCase();
    const index: TrGroup = baseGroup.find((v: TrGroup) => v === head) ?? '_';

    return SnippetObj[index]; // some case
}
