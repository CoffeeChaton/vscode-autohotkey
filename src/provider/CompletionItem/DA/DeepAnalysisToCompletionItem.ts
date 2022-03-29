import * as vscode from 'vscode';
import { DeepAnalysisResult, TAhkSymbol, TSnippetRecMap } from '../../../globalEnum';
import { DeepAnalysis } from '../../../tools/DeepAnalysis/DeepAnalysis';
import { kindPick } from '../../../tools/Func/kindPick';
import { getFnOfPos } from '../../../tools/getScopeOfPos';
import { isPosAtStr } from '../../../tools/isPosAtStr';
import { getParamCompletion } from './completion/getArgCompletion';
import { getUnknownTextCompletion } from './completion/getUnknownTextCompletion';
import { getValCompletion } from './completion/getValCompletion';
import { getRecMap } from './rec/getRecMap';

function suggest(
    ed: DeepAnalysisResult,
    ahkSymbol: TAhkSymbol,
    position: vscode.Position,
    inputStr: string,
): vscode.CompletionItem[] {
    const { argMap, valMap, textMap } = ed;
    const { name } = ahkSymbol;
    const recMap: TSnippetRecMap = getRecMap(ed, ahkSymbol, position, inputStr);

    return [
        ...getParamCompletion(argMap, name, recMap),
        ...getValCompletion(valMap, name, recMap),
        ...getUnknownTextCompletion(textMap, name),
    ];
}

export function DeepAnalysisToCompletionItem(
    document: vscode.TextDocument,
    position: vscode.Position,
    inputStr: string,
): vscode.CompletionItem[] {
    if (isPosAtStr(document, position)) return [];

    const ahkSymbol: TAhkSymbol | null = getFnOfPos(document, position);
    if (!ahkSymbol) return [];

    const kindStr: 'Function' | 'Method' | null = kindPick(ahkSymbol.kind);
    if (!kindStr) return [];

    const DA: null | DeepAnalysisResult = DeepAnalysis(document, ahkSymbol);
    if (!DA) return [];

    return suggest(DA, ahkSymbol, position, inputStr);
}
