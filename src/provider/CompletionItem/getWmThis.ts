import * as vscode from 'vscode';
import { MyDocSymbol, TSymAndFsPath } from '../../globalEnum';
import { Pretreatment } from '../../tools/Pretreatment';

let wm: WeakMap<MyDocSymbol, vscode.CompletionItem[]> = new WeakMap();
let wmSize = 0;
setInterval(() => {
    wm = new WeakMap();
    wmSize = 0;
    console.log('getThisItemOfWm WeakMap clear 10 min');
    // eslint-disable-next-line no-magic-numbers
}, 10 * 60 * 1000); // 10 minute

export async function getWmThis(c0: TSymAndFsPath): Promise<vscode.CompletionItem[]> {
    const maybe = wm.get(c0.ahkSymbol);
    if (maybe) return maybe;
    const { ahkSymbol, fsPath } = c0;
    const Uri = vscode.Uri.file(fsPath);
    const document = await vscode.workspace.openTextDocument(Uri);
    const map = new Map() as Map<string, number>; // : Map<string, number>
    const lineBase = ahkSymbol.range.start.line;
    Pretreatment(document.getText(ahkSymbol.range).split('\n'))
        .forEach((v, index) => {
            const { lStr } = v;
            const matchAll = lStr.matchAll(/\bthis\.(\w\w+)\b/gi);
            for (const name of matchAll) {
                // console.log('name', name);
                // console.log('name', name[0].trim());
                map.set(name[1], index + lineBase);
            }
        });

    const itemS: vscode.CompletionItem[] = [];
    map.forEach((v, k) => {
        const item = new vscode.CompletionItem(k, vscode.CompletionItemKind.Value);
        item.detail = 'neko help : useDefClass';
        item.documentation = new vscode.MarkdownString(ahkSymbol.name, true)
            .appendMarkdown(`this.${k}\n\n`)
            .appendMarkdown(`of line ${v + 1}`);
        itemS.push(item);
    });

    wm.set(ahkSymbol, itemS);
    wmSize += itemS.length;
    // eslint-disable-next-line no-magic-numbers
    if (wmSize > 200) {
        wm = new WeakMap();
        wmSize = 0;
        // console.log('getThisItemOfWm WeakMap clear of wmSize > 200');
    }
    return itemS;
}
