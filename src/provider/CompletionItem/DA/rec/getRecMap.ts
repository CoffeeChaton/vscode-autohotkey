import * as vscode from 'vscode';
import { TSnippetRecMap } from '../../../../globalEnum';
import { TDeepAnalysisMeta } from '../../../../tools/DeepAnalysis/TypeFnMeta';
import { setParaRec } from './setParaRec';
import { getContextRange, setVarRec } from './setVarRec';

export function getRecMap(
    ed: TDeepAnalysisMeta,
    position: vscode.Position,
    RARange: vscode.Range,
    inputStr: string,
): TSnippetRecMap {
    const { argMap, valMap } = ed;
    const Rec: TSnippetRecMap = new Map();

    // if (!ahkSymbol.selectionRange.contains(position)) {
    setParaRec(Rec, argMap, inputStr);

    const contextRange: vscode.Range = getContextRange(position, RARange); // +-5 line
    setVarRec(Rec, valMap, inputStr, contextRange);
    // }
    return Rec;
}
