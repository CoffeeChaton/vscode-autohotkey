import * as vscode from 'vscode';
import { MyDocSymbol, TSymAndFsPath } from '../../globalEnum';
import { Pretreatment } from '../../tools/Pretreatment';
import { ClassWm } from '../../tools/wm';

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<MyDocSymbol, vscode.CompletionItem[]>(10 * 60 * 1000, 'getThisItemOfWm', 700);

export async function getWmThis(c0: TSymAndFsPath): Promise<vscode.CompletionItem[]> {
    const maybe = w.getWm(c0.ahkSymbol);
    if (maybe) return maybe;

    const { ahkSymbol, fsPath } = c0;
    const Uri = vscode.Uri.file(fsPath);
    const document = await vscode.workspace.openTextDocument(Uri);
    const mapStrNumber = new Map<string, number>(); // : Map<string, number>
    const lineBase = ahkSymbol.range.start.line;
    Pretreatment(document.getText(ahkSymbol.range).split('\n'))
        .forEach((v, index) => {
            const matchAll = v.lStr.matchAll(/\bthis\.(\w\w+)\b/gi);
            for (const name of matchAll) {
                // console.log('name', name);
                // console.log('name', name[0].trim());
                mapStrNumber.set(name[1], index + lineBase);
            }
        });

    const itemS: vscode.CompletionItem[] = [];
    mapStrNumber.forEach((value, key) => {
        const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Value);
        item.detail = 'neko help : useDefClass';
        item.documentation = new vscode.MarkdownString(ahkSymbol.name, true)
            .appendMarkdown(`\n\n    this.${key}\n\n`)
            .appendMarkdown(`line   ${value + 1}  of  ${fsPath}`);
        itemS.push(item);
    });

    return w.setWm(ahkSymbol, itemS);
}
