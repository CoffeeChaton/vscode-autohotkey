/* eslint-disable max-lines */
/* eslint-disable security/detect-unsafe-regex */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,15] }] */
import * as vscode from 'vscode';
import {
    EFnMode,
    EValType,
    TAhkSymbol,
    TAhkValType,
    TArgMap,
    TGetFnDefNeed,
    TRunValType2,
    TTokenStream,
    TValAnalysis,
    TValMap,
} from '../../../globalEnum';
import { fnModeToValType } from '../../Func/fnModeToValType';
import { getFnModeWM } from '../../Func/getFnMode';
import { forLoop } from './def/forLoop';
import { varSetCapacityFunc } from './def/varSetCapacityFunc';
import { walrusOperator } from './def/walrusOperator';

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

type TFnVarDef = {
    uri: vscode.Uri;
    ahkSymbol: TAhkSymbol;
    DocStrMap: TTokenStream;
    argMap: TArgMap;
    diagFnVar: vscode.Diagnostic[];
    warnNumber: [number];
};

export function getFnVarDef(
    {
        uri,
        ahkSymbol,
        DocStrMap,
        argMap,
        diagFnVar: diagVal,
        warnNumber,
    }: TFnVarDef,
): TValMap {
    const fnMode = getFnModeWM(ahkSymbol, DocStrMap);
    const valMap: TValMap = new Map<string, TValAnalysis>();

    const startLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range

        // eslint-disable-next-line no-magic-numbers
        if (lStr.trim().length < 2) continue; // a=b need length >=3

        const lineType: TAhkValType = getLineType(lStr, fnMode);
        const need: TGetFnDefNeed = {
            lStr,
            valMap,
            line,
            lineType,
            uri,
            argMap,
            diagVal,
            warnNumber,
        };
        walrusOperator(need); // :=
        varSetCapacityFunc(need); // VarSetCapacity(varName)
        forLoop(need); // for var1 , var2 in
    }

    return valMap;
}
