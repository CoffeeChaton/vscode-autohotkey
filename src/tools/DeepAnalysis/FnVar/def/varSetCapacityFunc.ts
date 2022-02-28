import * as vscode from 'vscode';
import { TGetFnDefNeed, TValAnalysis } from '../../../../globalEnum';
import { wrapFnValDef } from './wrapFnValDef';

// VarSetCapacity(varName)
export function varSetCapacityFunc({
    lStr,
    valMap,
    line,
    lineType,
    uri,
    argMap,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/(?<![.%`])\bVarSetCapacity\b\(\s*(\w+)\b/gui)) {
        const ch = v.index;
        if (ch === undefined) continue;

        const RawName = v[1];
        const UpName = RawName.toUpperCase();
        if (argMap.has(UpName)) continue;

        // eslint-disable-next-line no-magic-numbers
        const character = ch + 15;
        const range = new vscode.Range(
            new vscode.Position(line, character),
            new vscode.Position(line, character + RawName.length),
        );
        const defLoc = new vscode.Location(uri, range);

        const value: TValAnalysis = wrapFnValDef({
            RawNameNew: RawName,
            valMap,
            defLoc,
            lineType,
        });
        valMap.set(RawName.toUpperCase(), value);
    }
}
