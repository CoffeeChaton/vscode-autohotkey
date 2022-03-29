import {
    TAhkSymbol, TArgMap, TTokenStream, TValMap,
} from '../../../globalEnum';
import { getFnVarDef } from './getFnVarDef';
import { getFnVarRef } from './getFnVarRef';

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

    getFnVarRef(ahkSymbol, DocStrMap, valMap);

    return valMap;
}
