import { TAhkSymbol, TTokenStream } from '../../../globalEnum';
import { TArgMap, TValMap } from '../TypeFnMeta';
import { getFnVarDef } from './getFnVarDef';
import { getDARef } from './getFnVarRef';

export function getFnVarMain(
    AhkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
): TValMap {
    const valMap: TValMap = getFnVarDef({
        AhkSymbol,
        DocStrMap,
        argMap,
    });

    getDARef(AhkSymbol, DocStrMap, valMap);

    return valMap;
}
