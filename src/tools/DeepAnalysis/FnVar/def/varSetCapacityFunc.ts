import * as vscode from 'vscode';
import { TGetFnDefNeed, TValAnalysis } from '../../../../globalEnum';
import { wrapFnValDef } from './wrapFnValDef';

// VarSetCapacity(varName)
export function varSetCapacityFunc({
    lStr,
    valMap,
    line,
    lineType,
    argMap,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line no-magic-numbers
    if (lStr.length < 15) return;
    if (lStr.indexOf('(') === -1) return;
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/(?<![.%`])\bVarSetCapacity\b\(\s*(\w+)\b(?!\()/gui)) {
        const ch: number | undefined = v.index;
        if (ch === undefined) continue;

        const RawName: string = v[1];
        const UpName: string = RawName.toUpperCase();
        if (argMap.has(UpName)) continue;

        const character: number = ch + v[0].search(RawName); // "VarSetCapacity(".len ===  15
        const defRange: vscode.Range = new vscode.Range(
            new vscode.Position(line, character),
            new vscode.Position(line, character + RawName.length),
        );

        const value: TValAnalysis = wrapFnValDef({
            RawNameNew: RawName,
            valMap,
            defRange,
            lineType,
        });
        valMap.set(RawName.toUpperCase(), value);
    }
}
