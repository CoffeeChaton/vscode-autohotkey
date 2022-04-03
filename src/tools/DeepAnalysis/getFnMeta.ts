import { TAhkSymbol, TTokenStream } from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { getDocStrMapMask } from '../getDocStrMapMask';
import { ClassWm } from '../wm';
import { getFnVarMain } from './FnVar/getFnVarMain';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getParamMain } from './Param/getParam';
import {
    TArgMap,
    TDeepAnalysisMeta,
    TTextMap,
    TValMap,
} from './TypeFnMeta';

// eslint-disable-next-line no-magic-numbers
const hr2: number = 2 * 60 * 60 * 1000;
const wm = new ClassWm<TAhkSymbol, TDeepAnalysisMeta>(hr2, 'FnMeta', 0);

export function getFnMeta(AhkSymbol: TAhkSymbol, DocStrMap: TTokenStream): null | TDeepAnalysisMeta {
    const kindStr: 'Function' | 'Method' | null = kindPick(AhkSymbol.kind);
    if (kindStr === null) return null;

    const cache: undefined | TDeepAnalysisMeta = wm.getWm(AhkSymbol);
    if (cache !== undefined) return cache;

    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkSymbol, DocStrMap);

    const argMap: TArgMap = getParamMain(AhkSymbol, AhkTokenList);
    const valMap: TValMap = getFnVarMain(AhkSymbol, AhkTokenList, argMap);
    const textMap: TTextMap = getUnknownTextMap(AhkSymbol, AhkTokenList, argMap, valMap);
    const v: TDeepAnalysisMeta = {
        argMap,
        valMap,
        textMap,
        funcRawName: AhkSymbol.name,
        range: AhkSymbol.range,
    };

    return wm.setWm(AhkSymbol, v);
}
