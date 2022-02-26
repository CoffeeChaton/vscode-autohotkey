import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
    TValMap,
} from '../../../globalEnum';
import { getFnVarDef } from './getFnVarDef';
import { getFnVarRef } from './getFnVarRef';

export function getFnVarMain(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
): TValMap {
    const valMap: TValMap = getFnVarDef({
        uri,
        ahkSymbol,
        DocStrMap,
        argMap,
    });

    const valMap2 = getFnVarRef(uri, ahkSymbol, DocStrMap, valMap);

    return valMap2;
}
