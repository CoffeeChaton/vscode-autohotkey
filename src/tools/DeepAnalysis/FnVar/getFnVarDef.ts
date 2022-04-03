/* eslint-disable max-lines */
/* eslint-disable security/detect-unsafe-regex */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,15] }] */
import {
    EFnMode,
    EValType,
    TAhkSymbol,
    TRunValType2,
    TTokenStream,
} from '../../../globalEnum';
import { fnModeToValType } from '../../Func/fnModeToValType';
import { getFnModeWM } from '../../Func/getFnMode';
import {
    TAhkValType,
    TArgMap,
    TGetFnDefNeed,
    TValAnalysis,
    TValMap,
} from '../TypeFnMeta';
import { forLoop } from './def/forLoop';
import { NumGet } from './def/NumGet';
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
    // if lStr start with [,+-*]
    return fnModeToValType(fnMode);
}

type TFnVarDef = {
    AhkSymbol: TAhkSymbol;
    DocStrMap: TTokenStream;
    argMap: TArgMap;
};

export function getFnVarDef(
    {
        AhkSymbol,
        DocStrMap,
        argMap,
    }: TFnVarDef,
): TValMap {
    const fnMode = getFnModeWM(AhkSymbol, DocStrMap);
    const valMap: TValMap = new Map<string, TValAnalysis>();

    const startLine = AhkSymbol.selectionRange.end.line;
    const endLine = AhkSymbol.range.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range
        if (line > endLine) break;
        // eslint-disable-next-line no-magic-numbers
        if (lStr.trim().length < 2) continue; // a=b need length >=3

        const lineType: TAhkValType = getLineType(lStr, fnMode);
        const need: TGetFnDefNeed = {
            lStr,
            valMap,
            line,
            lineType,
            argMap,
        };
        walrusOperator(need); // :=
        varSetCapacityFunc(need); // VarSetCapacity(varName)
        forLoop(need); // for var1 , var2 in
        NumGet(need); // NumGet(varName)
        // TODO NumGet(VarOrAddress https://www.autohotkey.com/docs/commands/NumGet.htm
        // or NumGet(&VarOrAddress
        // TODO just `global variableName`, but not :=
    }

    return valMap;
}
