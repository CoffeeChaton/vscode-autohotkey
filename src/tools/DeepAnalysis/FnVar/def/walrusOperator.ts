import * as vscode from 'vscode';
import { TGetFnDefNeed, TValAnalysis } from '../../../../globalEnum';
import { wrapFnValDef } from './wrapFnValDef';

// := the walrus operator
export function walrusOperator({
    lStr,
    valMap,
    line,
    lineType,
    argMap,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/(?<![.`])\b(\w+)\b\s*:=/gui)) {
        const ch = v.index;
        if (ch === undefined) continue;

        const RawName = v[1];
        const UpName = RawName.toUpperCase();
        if (argMap.has(UpName)) continue;

        const character = ch;
        const defRange = new vscode.Range(
            new vscode.Position(line, character),
            new vscode.Position(line, character + RawName.length),
        );

        const value: TValAnalysis = wrapFnValDef({
            RawNameNew: RawName,
            valMap,
            defRange,
            lineType,
        });
        valMap.set(UpName, value);
    }
}
// Test OK     text := LT_bgColor_N := set_list := wait_time := Percentage := "Discard" ;clean
