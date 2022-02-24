import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
    TValMap,
} from '../../globalEnum';
import { getValDef } from './getValDef';
import { setValMapRef } from './setValMapRef';

type TSetValMap = {
    valMap: TValMap;
    diagVal: vscode.Diagnostic[];
};

export function setValMap(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
): TSetValMap {
    const diagVal: vscode.Diagnostic[] = []; // TODO NeverUsed or Inconsistent capitalization
    const valMap0: TValMap = getValDef(uri, ahkSymbol, DocStrMap, argMap, diagVal);

    const valMap = setValMapRef(uri, ahkSymbol, DocStrMap, valMap0, diagVal);

    return {
        valMap,
        diagVal,
    };
}
