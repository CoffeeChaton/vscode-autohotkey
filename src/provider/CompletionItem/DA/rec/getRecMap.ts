import * as vscode from 'vscode';
import {
    DeepAnalysisResult,
    TAhkSymbol,
    TSnippetRecMap,
} from '../../../../globalEnum';
import { setParaRec } from './setParaRec';
import { getContextRange, setVarRec } from './setVarRec';

export function getRecMap(
    ed: DeepAnalysisResult,
    ahkSymbol: TAhkSymbol,
    position: vscode.Position,
    inputStr: string,
): TSnippetRecMap {
    const { argMap, valMap } = ed;
    const Rec: TSnippetRecMap = new Map();

    if (!ahkSymbol.selectionRange.contains(position)) {
        setParaRec(Rec, argMap, inputStr);

        const contextRange = getContextRange(position, ahkSymbol); // +-5 line
        setVarRec(Rec, valMap, inputStr, contextRange);
    }
    return Rec;
}
