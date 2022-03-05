import {
    TAhkSymbol,
    TArgMap,
    TTokenStream,
} from '../../../globalEnum';
import { getFnVarRef } from '../FnVar/getFnVarRef';
import { getParamDef } from './getParamDef';

export function getParamMain(
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): TArgMap {
    const argMap: TArgMap = getParamDef(ahkSymbol, DocStrMap);
    getFnVarRef(ahkSymbol, DocStrMap, argMap);

    return argMap;
}
