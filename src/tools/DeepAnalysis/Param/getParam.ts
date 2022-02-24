import * as vscode from 'vscode';
import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
} from '../../../globalEnum';
import { getParamDef } from './getParamDef';
import { getParamRef } from './getParamRef';
import { paramNeverUsed } from './paramNeverUsed';

type TParamMap = {
    argMap: TArgMap;
    diagParam: vscode.Diagnostic[];
};

export function getParamMain(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): TParamMap {
    const diagParam: vscode.Diagnostic[] = [];
    const argMap: TArgMap = getParamDef(uri, ahkSymbol, DocStrMap);
    getParamRef(argMap, ahkSymbol, DocStrMap, uri, diagParam);

    paramNeverUsed(argMap);
    return {
        argMap,
        diagParam,
    };
}
