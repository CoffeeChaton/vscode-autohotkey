import * as vscode from 'vscode';
import { TGetFnDefNeed, TValAnalysis } from '../../../../globalEnum';
import { wrapFnValDef } from './wrapFnValDef';

// := the walrus operator
export function walrusOperator({
    lStr,
    valMap,
    line,
    lineType,
    uri,
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
        const range = new vscode.Range(
            new vscode.Position(line, character),
            new vscode.Position(line, character + RawName.length),
        );
        const defLoc = new vscode.Location(uri, range);

        const value: TValAnalysis = wrapFnValDef({
            RawName,
            valMap,
            defLoc,
            lineType,
        });
        valMap.set(UpName, value);
    }
}
// FIXME:     text := LT_bgColor_N := set_list := wait_time := Percentage := "Discard" ;clean
