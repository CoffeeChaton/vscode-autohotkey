import * as vscode from 'vscode';
import { CAhkFunc } from '../../../CAhkFunc';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
import { isPosAtStr } from '../../../tools/isPosAtStr';
import { getParamCompletion } from './completion/getArgCompletion';
import { getUnknownTextCompletion } from './completion/getUnknownTextCompletion';
import { getValCompletion } from './completion/getValCompletion';
import { TSnippetRecMap } from './ESnippetRecBecause';
import { getRecMap } from './rec/getRecMap';

function suggest(
    DA: CAhkFunc,
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

    const DA: undefined | CAhkFunc = getDAWithPos(document.uri.fsPath, position);
    if (DA === undefined) return [];

    return suggest(DA, position, inputStr);
}
