import * as vscode from 'vscode';
import {
    DeepAnalysisResult,
    TAhkSymbol,
} from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { kindPick } from '../../tools/Func/kindPick';
import { getFnOfPos } from '../../tools/getScopeOfPos';
import { isPosAtStr } from '../../tools/isPosAtStr';
import { getArgCompletion } from './getArgCompletion';
import { getTextCompletion } from './getTextCompletion';
import { getValCompletion } from './getValCompletion';

export function DeepAnalysisToCompletionItem(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.CompletionItem[] {
    if (isPosAtStr(document, position)) return [];

    const ahkSymbol: TAhkSymbol | null = getFnOfPos(document, position);
    if (!ahkSymbol) return [];

    const kindStr = kindPick(ahkSymbol.kind);
    if (!kindStr) return [];

    const ed: null | DeepAnalysisResult = DeepAnalysis(document, ahkSymbol);
    if (!ed) return [];

    const { argMap, valMap, textMap } = ed;
    const argCompletion = getArgCompletion(argMap, ahkSymbol.name);
    const valCompletion = getValCompletion(valMap, ahkSymbol.name);
    const textCompletion = getTextCompletion(textMap, ahkSymbol.name);

    return [...argCompletion, ...valCompletion, ...textCompletion];
}
