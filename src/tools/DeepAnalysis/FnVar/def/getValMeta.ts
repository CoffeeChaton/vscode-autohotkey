import * as vscode from 'vscode';
import { TValMap, TValMeta } from '../../TypeFnMeta';
import { wrapFnValDef } from './wrapFnValDef';

export function getValMeta(line: number, character: number, RawName: string, valMap: TValMap): TValMeta {
    const defRange: vscode.Range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + RawName.length),
    );

    const value: TValMeta = wrapFnValDef({
        RawNameNew: RawName,
        valMap,
        defRange,
    });
    return value;
}
