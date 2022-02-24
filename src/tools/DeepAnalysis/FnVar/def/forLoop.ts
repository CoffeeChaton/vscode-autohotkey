/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,15] }] */
import * as vscode from 'vscode';
import { TGetFnDefNeed, TValAnalysis } from '../../../../globalEnum';
import { wrapFnValDef } from './wrapFnValDef';

// For var1,var2 in Range
export function forLoop({
    lStr,
    valMap,
    line,
    lineType,
    uri,
    argMap,
    diagVal,
    warnNumber,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/[\s^]For\s+(\w+)\s*,\s*(\w+)?\s+in\s/giu)) {
        const ch = v.index;
        if (ch === undefined) continue;
        const v1 = v[1];
        if (v1 && !argMap.has(v1.toUpperCase())) {
            const character = ch + v[0].indexOf(v1, 3);
            const range = new vscode.Range(
                new vscode.Position(line, character),
                new vscode.Position(line, character + v1.length),
            );
            const defLoc = new vscode.Location(uri, range);

            const value: TValAnalysis = wrapFnValDef({
                RawName: v1,
                valMap,
                defLoc,
                lineType,
                diagVal,
                warnNumber,
            });
            valMap.set(v1.toUpperCase(), value);
        }

        const v2 = v[2];
        if (v2 && !argMap.has(v2.toUpperCase())) {
            const character = ch + v[0].lastIndexOf(v2);
            const range = new vscode.Range(
                new vscode.Position(line, character),
                new vscode.Position(line, character + v2.length),
            );
            const defLoc = new vscode.Location(uri, range);

            const value: TValAnalysis = wrapFnValDef({
                RawName: v2,
                valMap,
                defLoc,
                lineType,
                diagVal,
                warnNumber,
            });
            valMap.set(v2.toUpperCase(), value);
        }
    }
}
