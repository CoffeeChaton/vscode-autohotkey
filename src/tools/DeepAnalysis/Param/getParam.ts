import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
} from '../../../globalEnum';
import { getParamDef } from './getParamDef';
import { getParamRef } from './getParamRef';

export function getParamMain(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): TArgMap {
    const argMap: TArgMap = getParamDef(uri, ahkSymbol, DocStrMap);
    getParamRef(argMap, ahkSymbol, DocStrMap, uri);

    return argMap;
}
