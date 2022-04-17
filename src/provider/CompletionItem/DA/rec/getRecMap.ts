import * as vscode from 'vscode';
import { CAhkFuncSymbol } from '../../../../globalEnum';
import { TSnippetRecMap } from '../ESnippetRecBecause';
import { setParaRec } from './setParaRec';
import { getContextRange, setVarRec } from './setVarRec';

export function getRecMap(
    ed: CAhkFuncSymbol,
    position: vscode.Position,
    RARange: vscode.Range,
    inputStr: string,
): TSnippetRecMap {
    const { paramMap, valMap } = ed;
    const Rec: TSnippetRecMap = new Map();

    setParaRec(Rec, paramMap, inputStr);

    const contextRange: vscode.Range = getContextRange(position, RARange); // +-5 line
    setVarRec(Rec, valMap, inputStr, contextRange);

    return Rec;
}
