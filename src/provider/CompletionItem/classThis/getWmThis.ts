import * as vscode from 'vscode';
import { CAhkClass } from '../../../CAhkClass';
import { Detecter, TAhkFileData } from '../../../core/Detecter';
import { TTokenStream } from '../../../globalEnum';
import { getDocStrMapMask } from '../../../tools/getDocStrMapMask';
import { ClassWm } from '../../../tools/wm';

function getWmThisCore(AhkClassSymbol: CAhkClass): vscode.CompletionItem[] {
    const { fsPath } = AhkClassSymbol.uri;
    const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];
    const { DocStrMap } = AhkFileData;
    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkClassSymbol.range, DocStrMap);

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
        item.documentation = new vscode.MarkdownString(AhkClassSymbol.name, true)
            .appendMarkdown(`\n\n    this.${label}\n\n`)
            .appendMarkdown(`line   ${value + 1}  of  ${fsPath}`);
        itemS.push(item);
    });
    return itemS;
}

// eslint-disable-next-line no-magic-numbers
const wm: ClassWm<CAhkClass, vscode.CompletionItem[]> = new ClassWm(20 * 60 * 1000, 'getThisItemOfWm', 0);

export function getWmThis(AhkClassSymbol: CAhkClass): vscode.CompletionItem[] {
    const cache: vscode.CompletionItem[] | undefined = wm.getWm(AhkClassSymbol);
    if (cache !== undefined) return cache;

    const v: vscode.CompletionItem[] = getWmThisCore(AhkClassSymbol);
    return wm.setWm(AhkClassSymbol, v);
}
