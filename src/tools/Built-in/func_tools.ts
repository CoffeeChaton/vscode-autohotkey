/* eslint-disable max-lines-per-function */
/* eslint no-magic-numbers: ["error", { "ignore": [0,3] }] */
import * as vscode from 'vscode';
import { BuiltInFunctionObj } from './func';

const baseGroup = ['COM', 'IL_', 'LV_', 'OBJ', 'SB_', 'TV_', '_'] as const;

type TrGroup = typeof baseGroup[number];

type TSnip = { readonly [k in TrGroup]: readonly vscode.CompletionItem[] };

type TBiFuncMsg = {
    readonly md: vscode.MarkdownString;
    readonly keyRawName: string;
};
type TBiFuncMap = ReadonlyMap<string, TBiFuncMsg>;

//
export const [SnippetObj, BuiltInFuncMDMap] = ((): [TSnip, TBiFuncMap] => {
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

    const map2 = new Map<string, TBiFuncMsg>();

    type TV = typeof BuiltInFunctionObj[keyof typeof BuiltInFunctionObj];

    const makeMd = (v: TV): vscode.MarkdownString => {
        const {
            keyRawName,
            group,
            msg,
            link,
            exp,
        } = v;
        const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
            .appendMarkdown(`Built-in Function (${group})`)
            .appendCodeblock(`${keyRawName}()`, 'ahk')
            .appendMarkdown(msg)
            .appendMarkdown('\n')
            .appendMarkdown(`[(Read Doc)](${link})`)
            .appendMarkdown('\n\n***')
            .appendMarkdown('\n\n*exp:*')
            .appendCodeblock(exp.join('\n'));

        md.supportHtml = true;
        return md;
    };

    const makeSnip = (v: TV, md: vscode.MarkdownString): vscode.CompletionItem => {
        const { keyRawName, group, insert } = v;
        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `${keyRawName}()`, // Left
            description: group, // Right
        });
        item.kind = vscode.CompletionItemKind.Function;
        item.insertText = new vscode.SnippetString(insert);

        item.detail = 'Built-in Function (neko-help)';
        item.documentation = md;

        return item;
    };

    for (const [k, v] of Object.entries(BuiltInFunctionObj)) {
        const { keyRawName } = v;
        const md: vscode.MarkdownString = makeMd(v);
        map2.set(k, { keyRawName, md });

        const item: vscode.CompletionItem = makeSnip(v, md);

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
