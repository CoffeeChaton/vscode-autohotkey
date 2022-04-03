import * as vscode from 'vscode';
import { TAhkSymbol, TSymAndFsPath } from '../../../globalEnum';
import { Pretreatment } from '../../../tools/Pretreatment';
import { ClassWm } from '../../../tools/wm';

async function getWmThisCore({ AhkSymbol, fsPath }: TSymAndFsPath): Promise<vscode.CompletionItem[]> {
    const document: vscode.TextDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));
    const mapStrNumber = new Map<string, number>(); // : Map<string, number>
    const lineBase: number = AhkSymbol.range.start.line;
    Pretreatment(document.getText(AhkSymbol.range).split('\n'), lineBase)
        .forEach((v, index) => {
            [...v.lStr.matchAll(/\bthis\.(\w\w+)\b/gui)]
                .forEach((name) => {
                    if (!mapStrNumber.has(name[1])) mapStrNumber.set(name[1], index + lineBase);
                });
        });

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
const wm = new ClassWm<TAhkSymbol, vscode.CompletionItem[]>(10 * 60 * 1000, 'getThisItemOfWm', 700);

export async function getWmThis(c0: TSymAndFsPath): Promise<vscode.CompletionItem[]> {
    const { AhkSymbol, fsPath } = c0;
    const cache: vscode.CompletionItem[] | undefined = wm.getWm(AhkSymbol);
    if (cache !== undefined) return cache;

    const v: vscode.CompletionItem[] = await getWmThisCore({ AhkSymbol, fsPath });
    return wm.setWm(AhkSymbol, v);
}
