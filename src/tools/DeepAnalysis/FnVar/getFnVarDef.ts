import { TAhkSymbol, TTokenStream } from '../../../globalEnum';
import { TParamMap, TValMap, TValMeta } from '../TypeFnMeta';
import { forLoop } from './def/forLoop';
import { varSetCapacityFunc } from './def/varSetCapacityFunc';
import { walrusOperator } from './def/walrusOperator';
import { TGetFnDefNeed } from './TFnVarDef';

export function getFnVarDef(
    AhkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    paramMap: TParamMap,
): TValMap {
    const valMap: TValMap = new Map<string, TValMeta>();

    const startLine = AhkSymbol.selectionRange.end.line;
    const endLine = AhkSymbol.range.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue; // in arg Range
        if (line > endLine) break;
        // eslint-disable-next-line no-magic-numbers
        if (lStr.trim().length < 2) continue; // a=b need length >=3

        const need: TGetFnDefNeed = {
            lStr,
            valMap,
            line,
            paramMap,
        };
        walrusOperator(need); // :=
        varSetCapacityFunc(need); // VarSetCapacity(varName) or NumGet(varName) or NumGet(&varName)
        forLoop(need); // for var1 , var2 in
    }

    return valMap;
}
