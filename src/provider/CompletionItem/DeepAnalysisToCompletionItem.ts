import * as vscode from 'vscode';
import {
    DeepAnalysisResult,
    TAhkSymbol,
} from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { kindPick } from '../../tools/Func/kindPick';
import { getFnOfPos } from '../../tools/getScopeOfPos';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { suggest } from './DA/suggestSort';

export function DeepAnalysisToCompletionItem(
    document: vscode.TextDocument,
    position: vscode.Position,
    inputStr: string,
): vscode.CompletionItem[] {
    if (isPosAtStr(document, position)) return [];

    const ahkSymbol: TAhkSymbol | null = getFnOfPos(document, position);
    if (!ahkSymbol) return [];

    const kindStr = kindPick(ahkSymbol.kind);
    if (!kindStr) return [];

    const ed: null | DeepAnalysisResult = DeepAnalysis(document, ahkSymbol);
    if (!ed) return [];

    return suggest(ed, ahkSymbol, position, inputStr);
}
