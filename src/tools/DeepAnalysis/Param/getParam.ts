import { TAhkSymbol, TTokenStream } from '../../../globalEnum';
import { getDARef } from '../FnVar/getFnVarRef';
import { TArgMap } from '../TypeFnMeta';
import { getParamDef } from './getParamDef';

export function getParamMain(
    AhkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): TArgMap {
    const argMap: TArgMap = getParamDef(AhkSymbol, DocStrMap);
    getDARef(AhkSymbol, DocStrMap, argMap);

    return argMap;
}
