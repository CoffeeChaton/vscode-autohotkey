import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
} from '../../../globalEnum';
import { getFnVarRef } from '../FnVar/getFnVarRef';
import { getParamDef } from './getParamDef';

export function getParamMain(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): TArgMap {
    const argMap: TArgMap = getParamDef(uri, ahkSymbol, DocStrMap);
    getFnVarRef(uri, ahkSymbol, DocStrMap, argMap);

    return argMap;
}
