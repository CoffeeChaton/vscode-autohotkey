import * as vscode from 'vscode';
import { CAhkClass } from '../../../CAhkClass';
import { Detecter, TAhkFileData } from '../../../core/Detecter';
import { TTokenStream } from '../../../globalEnum';
import { getDocStrMapMask } from '../../../tools/getDocStrMapMask';

function getWmThisCore(AhkClassSymbol: CAhkClass): vscode.CompletionItem[] {
    const { fsPath } = AhkClassSymbol.uri;
    const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
    if (AhkFileData === undefined) return [];
    const { DocStrMap } = AhkFileData;
    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkClassSymbol.range, DocStrMap);

    const mapStrNumber: Map<string, number> = new Map();

    for (const { lStr, line } of AhkTokenList) {
        for (const ma of lStr.matchAll(/\bthis\.(\w+)\b(?!\()/gui)) {
            const valName = ma[1];
            if (!mapStrNumber.has(valName)) {
                mapStrNumber.set(valName, line);
            }
        }
    }

    const itemS: vscode.CompletionItem[] = [];
    for (const [label, line] of mapStrNumber) {
        const item = new vscode.CompletionItem({ label, description: 'this' }, vscode.CompletionItemKind.Value);
        item.detail = 'neko help : class > this';
        item.documentation = new vscode.MarkdownString(AhkClassSymbol.name, true)
            .appendMarkdown(`\n\n    this.${label}\n\n`)
            .appendMarkdown(`line   ${line + 1}  of  ${fsPath}`);
        itemS.push(item);
    }
    return itemS;
}

const wm: WeakMap<CAhkClass, vscode.CompletionItem[]> = new WeakMap();

export function getWmThis(AhkClassSymbol: CAhkClass): vscode.CompletionItem[] {
    const cache: vscode.CompletionItem[] | undefined = wm.get(AhkClassSymbol);
    if (cache !== undefined) return cache;

    const v: vscode.CompletionItem[] = getWmThisCore(AhkClassSymbol);
    wm.set(AhkClassSymbol, v);
    return v;
}
