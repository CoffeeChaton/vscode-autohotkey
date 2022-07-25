import type { TParamMapIn, TValMapIn, TValMetaIn } from '../../../AhkSymbol/CAhkFunc';
import type { TGValMap } from '../../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../../globalEnum';
import { forLoop } from './def/forLoop';
import { varSetCapacityFunc } from './def/varSetCapacityFunc';
import { walrusOperator } from './def/walrusOperator';
import type { TGetFnDefNeed } from './TFnVarDef';

export function getFnVarDef(
    startLine: number,
    endLine: number,
    DocStrMap: TTokenStream,
    paramMap: TParamMapIn,
    GValMap: TGValMap,
): TValMapIn {
    const valMap: TValMapIn = new Map<string, TValMetaIn>();
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range
        if (line > endLine) break;

        const lStrTrimLen: number = lStr.trim().length;
        if (lStrTrimLen < 2) continue; // a=b need length >=3

        const need: TGetFnDefNeed = {
            lStr,
            valMap,
            line,
            paramMap,
            GValMap,
            lStrTrimLen,
        };
        walrusOperator(need); // :=
        varSetCapacityFunc(need); // VarSetCapacity(varName) or NumGet(varName) or NumGet(&varName)
        forLoop(need); // for var1 , var2 in
    }

    return valMap;
}
