import * as vscode from 'vscode';
import { Bif2Md, BuiltInFuncMDMap, BuiltInFunctionObj } from '../../tools/Built-in/func';

const enum EMagic {
    // eslint-disable-next-line no-magic-numbers
    len = 3,
}
const baseGroup = ['COM', 'IL_', 'LV_', 'OBJ', 'SB_', 'TV_', '_'] as const;

type TrGroup = typeof baseGroup[number];

type TSnip = {
    readonly [k in TrGroup]: readonly vscode.CompletionItem[];
};

const SnippetObj: TSnip = ((): TSnip => {
    // initialize
    type TSnipTemp = {
        [k in TrGroup]: vscode.CompletionItem[];
    };

    const SnipTempObj: TSnipTemp = {
        COM: [],
        IL_: [],
        LV_: [],
        OBJ: [],
        SB_: [],
        TV_: [],
        _: [],
    };

    for (const [ukName, BiFunc] of Object.entries(BuiltInFunctionObj)) {
        const { keyRawName, group, insert } = BiFunc;

        const item: vscode.CompletionItem = new vscode.CompletionItem({
            label: `${keyRawName}()`, // Left
            description: group, // Right
        });
        item.kind = vscode.CompletionItemKind.Function;
        item.insertText = new vscode.SnippetString(insert);

        item.detail = 'Built-in Function (neko-help)';
        item.documentation = BuiltInFuncMDMap.get(ukName) ?? Bif2Md(BiFunc);

        const head = ukName.substring(0, EMagic.len);

        const index: TrGroup = baseGroup.find((v: TrGroup) => v === head) ?? '_';
        SnipTempObj[index].push(item);
    }

    return SnipTempObj;
})();

export function BuiltInFunc2Completion(inputStr: string): readonly vscode.CompletionItem[] {
    if (inputStr.length < EMagic.len) {
        const result: vscode.CompletionItem[] = [];
        for (const v of Object.values(SnippetObj)) {
            result.push(...v);
        }
        return result; // 111
    }

    const head: string = inputStr.substring(0, EMagic.len).toUpperCase();
    // head.len is 3 !== '_'
    const index: TrGroup = baseGroup.find((v: TrGroup) => v === head) ?? '_';

    return SnippetObj[index];
}
