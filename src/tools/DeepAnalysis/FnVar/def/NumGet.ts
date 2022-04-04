import * as vscode from 'vscode';
import { TGetFnDefNeed, TValAnalysis } from '../../TypeFnMeta';
import { wrapFnValDef } from './wrapFnValDef';

// NumGet(varName)
// NumGet(&varName)
export function NumGet({
    lStr,
    valMap,
    line,
    lineType,
    argMap,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line no-magic-numbers
    if (lStr.length < 7) return;
    if (lStr.indexOf('(') === -1) return;
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/(?<![.%`])\bNumGet\b\(\s*&?(\w+)\b(?!\()/gui)) {
        const ch = v.index;
        if (ch === undefined) continue;

        const RawName = v[1];
        const UpName = RawName.toUpperCase();
        if (argMap.has(UpName)) continue;

        // eslint-disable-next-line no-magic-numbers
        const character: number = ch + v[0].indexOf(RawName); // "NumGet(".len ===  7
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
