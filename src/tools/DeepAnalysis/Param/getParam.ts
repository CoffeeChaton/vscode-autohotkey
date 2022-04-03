import { TAhkSymbol, TTokenStream } from '../../../globalEnum';
import { TArgMap } from '../FnMetaType';
import { getDARef } from '../FnVar/getFnVarRef';
import { getParamDef } from './getParamDef';

export function getParamMain(
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): TArgMap {
    const argMap: TArgMap = getParamDef(ahkSymbol, DocStrMap);
    getDARef(ahkSymbol, DocStrMap, argMap);

    return argMap;
}
