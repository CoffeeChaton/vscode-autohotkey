import { TAhkSymbol, TAhkToken, TTokenStream } from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
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

function getDocStrMapMask(ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TTokenStream {
    const startLine: number = ahkSymbol.range.start.line;
    const endLine: number = ahkSymbol.range.end.line;
    const AhkTokenList: TAhkToken = [];
    for (const e of DocStrMap) {
        if (e.line < startLine) continue;
        if (e.line > endLine) break;
        AhkTokenList.push(e);
    }
    return AhkTokenList;
}

// eslint-disable-next-line no-magic-numbers
const hr2: number = 2 * 60 * 60 * 1000;
const wm = new ClassWm<TAhkSymbol, TDeepAnalysisMeta>(hr2, 'FnMeta', 0);

export function getFnMeta(ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): null | TDeepAnalysisMeta {
    const kindStr: 'Function' | 'Method' | null = kindPick(ahkSymbol.kind);
    if (kindStr === null) return null;

    const cache: undefined | TDeepAnalysisMeta = wm.getWm(ahkSymbol);
    if (cache !== undefined) return cache;

    const AhkTokenList: TTokenStream = getDocStrMapMask(ahkSymbol, DocStrMap);

    const argMap: TArgMap = getParamMain(ahkSymbol, AhkTokenList);
    const valMap: TValMap = getFnVarMain(ahkSymbol, AhkTokenList, argMap);
    const textMap: TTextMap = getUnknownTextMap(ahkSymbol, AhkTokenList, argMap, valMap);
    const v: TDeepAnalysisMeta = {
        argMap,
        valMap,
        textMap,
        funcRawName: ahkSymbol.name,
        range: ahkSymbol.range,
    };

    return wm.setWm(ahkSymbol, v);
}
