import * as vscode from 'vscode';
import { TGetFnDefNeed, TValAnalysis } from '../../TypeFnMeta';
import { wrapFnValDef } from './wrapFnValDef';

// := the walrus operator
export function walrusOperator({
    lStr,
    valMap,
    line,
    lineType,
    argMap,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line no-magic-numbers
    if (lStr.trim().length < 4) return; // A:= ----> len 3
    if (lStr.indexOf(':=') === -1) return;

    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gu)) {
        const character: number | undefined = v.index;
        if (character === undefined) continue;

        const RawName: string = v[1];
        const UpName: string = RawName.toUpperCase();
        if (argMap.has(UpName)) continue;

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
        valMap.set(UpName, value);
    }
}

// Test OK     text := LT_bgColor_N := set_list := wait_time := Percentage := "Discard" ;clean
// TODO .= += -=
