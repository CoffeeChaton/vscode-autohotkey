/* eslint-disable security/detect-unsafe-regex */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,15] }] */
import * as vscode from 'vscode';
import {
    EFnMode,
    EValType,
    TAhkSymbol,
    TAhkValType,
    TArgMap,
    TRunValType2,
    TTokenStream,
    TValAnalysis,
    TValMap,
} from '../../globalEnum';
import { fnModeToValType } from '../Func/fnModeToValType';
import { getFnModeWM } from '../Func/getFnMode';
import { getValue } from './getValue';

function getLineType(lStr: string, fnMode: EFnMode): EValType.local | EValType.global | EValType.Static {
    const fnTypeList: ([RegExp, TRunValType2])[] = [
        [/^\s*local[\s,]/iu, EValType.local],
        [/^\s*global[\s,]/iu, EValType.global],
        [/^\s*Static[\s,]/iu, EValType.Static],
    ];
    for (const [ruler, t] of fnTypeList) {
        if (ruler.test(lStr)) {
            return t;
        }
    }
    return fnModeToValType(fnMode);
}

type TNeed = {
    lStr: string;
    valMap: TValMap;
    line: number;
    lineType: TAhkValType;
    uri: vscode.Uri;
    argMap: TArgMap;
};

// := the walrus operator
function getVarOfWalrusOperator({
    lStr,
    valMap,
    line,
    lineType,
    uri,
    argMap,
}: TNeed): void {
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

        const value: TValAnalysis = getValue({
            RawName,
            valMap,
            defLoc,
            lineType,
        });
        valMap.set(UpName, value);
    }
}

// VarSetCapacity(varName)
function getVarOfVarSetCapacity({
    lStr,
    valMap,
    line,
    lineType,
    uri,
    argMap,
}: TNeed): void {
    for (const v of lStr.matchAll(/(?<![.%`])\bVarSetCapacity\b\(\s*(\w+)\b/gui)) {
        const ch = v.index;
        if (ch === undefined) continue;

        const RawName = v[1];
        const UpName = RawName.toUpperCase();
        if (argMap.has(UpName)) continue;

        const character = ch + 15;
        const range = new vscode.Range(
            new vscode.Position(line, character),
            new vscode.Position(line, character + RawName.length),
        );
        const defLoc = new vscode.Location(uri, range);

        const value: TValAnalysis = getValue({
            RawName,
            valMap,
            defLoc,
            lineType,
        });
        valMap.set(RawName.toUpperCase(), value);
    }
}

// for var1,var2 in
function getVarOfForLoop({
    lStr,
    valMap,
    line,
    lineType,
    uri,
    argMap,
}: TNeed): void {
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

            const value: TValAnalysis = getValue({
                RawName: v1,
                valMap,
                defLoc,
                lineType,
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

            const value: TValAnalysis = getValue({
                RawName: v2,
                valMap,
                defLoc,
                lineType,
            });
            valMap.set(v2.toUpperCase(), value);
        }
    }
}

export function getValDef(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
): TValMap {
    const fnMode = getFnModeWM(ahkSymbol, DocStrMap);
    const valMap: TValMap = new Map<string, TValAnalysis>();

    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range

        // eslint-disable-next-line no-magic-numbers
        if (lStr.trim().length < 2) continue; // a=b need length >=3

        const lineType: TAhkValType = getLineType(lStr, fnMode);
        const need: TNeed = {
            lStr,
            valMap,
            line,
            lineType,
            uri,
            argMap,
        };
        getVarOfWalrusOperator(need); // :=
        getVarOfVarSetCapacity(need); // VarSetCapacity(varName)
        getVarOfForLoop(need); // for var1 , var2 in
    }

    return valMap;
}
