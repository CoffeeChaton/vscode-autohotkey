/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4,5] }] */
import * as vscode from 'vscode';
import { DeepAnalysisResult, TAhkSymbol } from '../../../globalEnum';
import { getArgCompletion } from './getArgCompletion';
import { getUnknownTextCompletion } from './getUnknownTextCompletion';
import { getValCompletion } from './getValCompletion';

function getContextRange(position: vscode.Position, ahkSymbol: TAhkSymbol): vscode.Range {
    const startLine = Math.max(position.line - 5, ahkSymbol.selectionRange.end.line);
    const endLine = Math.min(position.line + 5, ahkSymbol.range.end.line);

    return new vscode.Range(startLine, 0, endLine, 0);
}

function getSuggestList(
    ed: DeepAnalysisResult,
    ahkSymbol: TAhkSymbol,
    position: vscode.Position,
    inputStr: string,
): Set<string> {
    const { argMap, valMap } = ed;
    const suggestList: Set<string> = new Set<string>();

    if (!ahkSymbol.selectionRange.contains(position)) {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        for (const [_upName, ArgAnalysis] of argMap) {
            // arg Never user or startsWith
            if (ArgAnalysis.refLoc.length === 0 || ArgAnalysis.keyRawName.startsWith(inputStr)) {
                suggestList.add(ArgAnalysis.keyRawName);
            }
        }

        // context suggest
        const contextRange = getContextRange(position, ahkSymbol);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        for (const [_upName, ValAnalysis] of valMap) {
            // +- 5 line
            const { defLoc, refLoc, keyRawName } = ValAnalysis;
            [...defLoc, ...refLoc].forEach((loc): void => {
                if (loc.range.contains(contextRange)) suggestList.add(keyRawName);
            });
            // start with
            if (keyRawName.startsWith(inputStr)) {
                suggestList.add(keyRawName);
            }
        }
    }
    return suggestList;
}

export function suggest(
    ed: DeepAnalysisResult,
    ahkSymbol: TAhkSymbol,
    position: vscode.Position,
    inputStr: string,
): vscode.CompletionItem[] {
    const { argMap, valMap, textMap } = ed;
    const { name } = ahkSymbol;
    const suggestList: Set<string> = getSuggestList(ed, ahkSymbol, position, inputStr);

    const argCompletion = getArgCompletion(argMap, name, suggestList);
    const valCompletion = getValCompletion(valMap, name, suggestList);
    const textCompletion = getUnknownTextCompletion(textMap, name);

    return [...argCompletion, ...valCompletion, ...textCompletion];
}
