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
    diagVal,
    warnNumber,
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
            diagVal,
            warnNumber,
        });
        valMap.set(UpName, value);
    }
}
