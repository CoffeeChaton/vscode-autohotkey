import * as vscode from 'vscode';
import { Detecter, TAhkFileData } from '../../../core/Detecter';
import {
    TAhkSymbol,
    TFsPath,
    TSymAndFsPath,
    TTokenStream,
} from '../../../globalEnum';
import { getDocStrMapMask } from '../../../tools/getDocStrMapMask';
import { ClassWm } from '../../../tools/wm';

function getWmThisCore(
    AhkSymbol: TAhkSymbol,
    fsPath: TFsPath,
): vscode.CompletionItem[] {
    const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];
    const { DocStrMap } = AhkFileData;
    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkSymbol.range, DocStrMap);

    const mapStrNumber: Map<string, number> = new Map();

    for (const { lStr, line } of AhkTokenList) {
        for (const ma of lStr.matchAll(/\bthis\.(\w+)\b(?!\()/gui)) {
            if (!mapStrNumber.has(ma[1])) {
                mapStrNumber.set(ma[1], line);
            }
        }
    }

    const itemS: vscode.CompletionItem[] = [];
    mapStrNumber.forEach((value: number, label: string): void => {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Value);
        item.detail = 'neko help : useDefClass';
        item.documentation = new vscode.MarkdownString(AhkSymbol.name, true)
            .appendMarkdown(`\n\n    this.${label}\n\n`)
            .appendMarkdown(`line   ${value + 1}  of  ${fsPath}`);
        itemS.push(item);
    });
    return itemS;
}

// eslint-disable-next-line no-magic-numbers
const wm: ClassWm<TAhkSymbol, vscode.CompletionItem[]> = new ClassWm(20 * 60 * 1000, 'getThisItemOfWm', 0);

export function getWmThis(c0: TSymAndFsPath): vscode.CompletionItem[] {
    const { AhkSymbol, fsPath } = c0;
    const cache: vscode.CompletionItem[] | undefined = wm.getWm(AhkSymbol);
    if (cache !== undefined) return cache;

    const v: vscode.CompletionItem[] = getWmThisCore(AhkSymbol, fsPath);
    return wm.setWm(AhkSymbol, v);
}
