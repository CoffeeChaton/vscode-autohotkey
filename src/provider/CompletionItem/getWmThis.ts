import * as vscode from 'vscode';
import { TAhkSymbol, TSymAndFsPath } from '../../globalEnum';
import { Pretreatment } from '../../tools/Pretreatment';
import { ClassWm } from '../../tools/wm';

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<TAhkSymbol, vscode.CompletionItem[]>(10 * 60 * 1000, 'getThisItemOfWm', 700);

async function getWmThisCore({ ahkSymbol, fsPath }: TSymAndFsPath): Promise<vscode.CompletionItem[]> {
    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
    const mapStrNumber = new Map<string, number>(); // : Map<string, number>
    const lineBase = ahkSymbol.range.start.line;
    Pretreatment(document.getText(ahkSymbol.range).split('\n'), lineBase)
        .forEach((v, index) => {
            [...v.lStr.matchAll(/\bthis\.(\w\w+)\b/gui)]
                .forEach((name) => {
                    if (!mapStrNumber.has(name[1])) mapStrNumber.set(name[1], index + lineBase);
                });
        });

    const itemS: vscode.CompletionItem[] = [];
    mapStrNumber.forEach((value, label) => {
        const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Value);
        item.detail = 'neko help : useDefClass';
        item.documentation = new vscode.MarkdownString(ahkSymbol.name, true)
            .appendMarkdown(`\n\n    this.${label}\n\n`)
            .appendMarkdown(`line   ${value + 1}  of  ${fsPath}`);
        itemS.push(item);
    });
    return itemS;
}

export async function getWmThis(c0: TSymAndFsPath): Promise<vscode.CompletionItem[]> {
    const { ahkSymbol, fsPath } = c0;
    const cache = w.getWm(ahkSymbol);
    if (cache) return cache;

    const v = await getWmThisCore({ ahkSymbol, fsPath });
    return w.setWm(ahkSymbol, v);
}
