import * as vscode from 'vscode';
import { TSnippetRecMap } from '../../../globalEnum';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
import { TDAMeta } from '../../../tools/DeepAnalysis/TypeFnMeta';
import { isPosAtStr } from '../../../tools/isPosAtStr';
import { getParamCompletion } from './completion/getArgCompletion';
import { getUnknownTextCompletion } from './completion/getUnknownTextCompletion';
import { getValCompletion } from './completion/getValCompletion';
import { getRecMap } from './rec/getRecMap';

function suggest(
    DA: TDAMeta,
    position: vscode.Position,
    inputStr: string,
): vscode.CompletionItem[] {
    const { paramMap, valMap, textMap } = DA;
    const { funcRawName, range } = DA;
    const recMap: TSnippetRecMap = getRecMap(DA, position, range, inputStr);

    return [
        ...getParamCompletion(paramMap, funcRawName, recMap),
        ...getValCompletion(valMap, funcRawName, recMap),
        ...getUnknownTextCompletion(textMap, funcRawName),
    ];
}

// don't use weakMap Memo, because position && inputStr
// && DA is fragile.
export function DeepAnalysisToCompletionItem(
    document: vscode.TextDocument,
    position: vscode.Position,
    inputStr: string,
): vscode.CompletionItem[] {
    if (isPosAtStr(document, position)) return [];

    const DA: undefined | TDAMeta = getDAWithPos(document, position);
    if (DA === undefined) return [];

    return suggest(DA, position, inputStr);
}
