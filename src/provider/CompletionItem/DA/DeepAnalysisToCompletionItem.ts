import * as vscode from 'vscode';
import { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import { TTopSymbol } from '../../../AhkSymbol/TAhkSymbolIn';
import { getDAWithPos } from '../../../tools/DeepAnalysis/getDAWithPos';
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
    position: vscode.Position,
    inputStr: string,
    AhkSymbolList: readonly TTopSymbol[],
): vscode.CompletionItem[] {
    const DA: null | CAhkFunc = getDAWithPos(AhkSymbolList, position);
    return DA === null
        ? []
        : suggest(DA, position, inputStr);
}
