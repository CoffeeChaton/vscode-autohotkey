import { TAhkSymbol, TTokenStream } from '../../../globalEnum';
import { TArgMap, TValMap } from '../FnMetaType';
import { getFnVarDef } from './getFnVarDef';
import { getDARef } from './getFnVarRef';

export function getFnVarMain(
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
    argMap: TArgMap,
): TValMap {
    const valMap: TValMap = getFnVarDef({
        ahkSymbol,
        DocStrMap,
        argMap,
    });

    getDARef(ahkSymbol, DocStrMap, valMap);

    return valMap;
}
