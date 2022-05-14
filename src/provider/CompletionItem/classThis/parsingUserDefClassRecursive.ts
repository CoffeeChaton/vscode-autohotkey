import * as vscode from 'vscode';
import { CAhkClass, TClassChildren } from '../../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { getUserDefTopClassSymbol } from './getUserDefTopClassSymbol';

function getKindOfCh(kind: vscode.SymbolKind): vscode.CompletionItemKind {
    // dprint-ignore
    switch (kind) {
        case vscode.SymbolKind.Class: return vscode.CompletionItemKind.Class;
        case vscode.SymbolKind.Method: return vscode.CompletionItemKind.Method;
        case vscode.SymbolKind.Property: return vscode.CompletionItemKind.Property;
        case vscode.SymbolKind.Variable: return vscode.CompletionItemKind.Variable;
        default: return vscode.CompletionItemKind.User;
    }
}

function wrapItem(
    AhkSymbol: TClassChildren,
    track: string[],
): vscode.CompletionItem {
    const item: vscode.CompletionItem = new vscode.CompletionItem(AhkSymbol.name.trim(), getKindOfCh(AhkSymbol.kind));
    item.detail = 'neko help; (wrapClass)';
    if (
        AhkSymbol instanceof CAhkFunc
        && AhkSymbol.kind === vscode.SymbolKind.Method
    ) {
        item.documentation = AhkSymbol.md;
        item.label = AhkSymbol.selectionRangeText;
        item.insertText = AhkSymbol.selectionRangeText;
        return item;
    }

    const md = new vscode.MarkdownString('', true);
    md.appendMarkdown([...track].reverse().join('   \n'));
    item.documentation = md;
    return item;
}

export function parsingUserDefClassRecursive(
    AhkSymbol: CAhkClass,
    track: readonly string[],
    ChapterArr: readonly string[],
    deep: number,
): vscode.CompletionItem[] {
    const itemS: vscode.CompletionItem[] = [];
    const newTrack = [...track, `Class  ${AhkSymbol.name}`];
    for (const ch of AhkSymbol.children) {
        //
        if (ChapterArr.length === deep) {
            itemS.push(wrapItem(ch, newTrack));
        }

        // track
        if (
            ch.kind === vscode.SymbolKind.Class
            && ChapterArr[deep].toUpperCase() === ch.upName
        ) {
            itemS.push(...parsingUserDefClassRecursive(ch, newTrack, ChapterArr, deep + 1)); // getCh
        }
    }

    const ahkExtends: string = AhkSymbol.detail;
    if (ahkExtends !== '') {
        const c1: CAhkClass | null = getUserDefTopClassSymbol(ahkExtends.toUpperCase());
        if (c1 !== null) {
            itemS.push(...parsingUserDefClassRecursive(c1, newTrack, ChapterArr, deep));
        }
    }

    return itemS;
}
