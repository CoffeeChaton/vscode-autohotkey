import * as vscode from 'vscode';
import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { getWmThis } from './getWmThis';
import { parsingUserDefClassRecursive } from './parsingUserDefClassRecursive';

export function RefClassWithName(ChapterArr: readonly string[], classSymbol: CAhkClass): vscode.CompletionItem[] {
    const ahkThis = ChapterArr.length === 1
        ? getWmThis(classSymbol)
        : [];
    return [
        ...parsingUserDefClassRecursive(classSymbol, [classSymbol.uri.fsPath], ChapterArr, 1),
        ...ahkThis,
    ];
}
