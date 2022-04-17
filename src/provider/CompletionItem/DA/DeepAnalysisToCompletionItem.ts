import * as vscode from 'vscode';
import { CAhkFuncSymbol, TSnippetRecMap } from '../../../globalEnum';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
import { isPosAtStr } from '../../../tools/isPosAtStr';
import { getParamCompletion } from './completion/getArgCompletion';
import { getUnknownTextCompletion } from './completion/getUnknownTextCompletion';
import { getValCompletion } from './completion/getValCompletion';
import { getRecMap } from './rec/getRecMap';

function suggest(
    DA: CAhkFuncSymbol,
    position: vscode.Position,
    inputStr: string,
): vscode.CompletionItem[] {
    const { paramMap, valMap, textMap } = DA;
    const { name, range } = DA;
    const recMap: TSnippetRecMap = getRecMap(DA, position, range, inputStr);

    return [
        ...getParamCompletion(paramMap, name, recMap),
        ...getValCompletion(valMap, name, recMap),
        ...getUnknownTextCompletion(textMap, name),
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

    const DA: undefined | CAhkFuncSymbol = getDAWithPos(document, position);
    if (DA === undefined) return [];

    return suggest(DA, position, inputStr);
}
