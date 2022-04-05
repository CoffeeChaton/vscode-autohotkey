import { TAhkSymbol, TTokenStream } from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { getDocStrMapMask } from '../getDocStrMapMask';
import { ClassWm } from '../wm';
import { getFnVarDef } from './FnVar/getFnVarDef';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getParamDef } from './Param/getParamDef';
import {
    TDAMeta,
    TParamMap,
    TTextMap,
    TValMap,
} from './TypeFnMeta';

// eslint-disable-next-line no-magic-numbers
const hr2: number = 2 * 60 * 60 * 1000;
const wm = new ClassWm<TAhkSymbol, TDAMeta>(hr2, 'FnMeta', 0);

export function getFnMeta(AhkSymbol: TAhkSymbol, DocStrMap: TTokenStream): null | TDAMeta {
    const kindStr: 'Function' | 'Method' | null = kindPick(AhkSymbol.kind);
    if (kindStr === null) return null;

    const cache: undefined | TDAMeta = wm.getWm(AhkSymbol);
    if (cache !== undefined) return cache;

    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkSymbol, DocStrMap);

    const paramMap: TParamMap = getParamDef(AhkSymbol, AhkTokenList);
    const valMap: TValMap = getFnVarDef(AhkSymbol, AhkTokenList, paramMap);
    const textMap: TTextMap = getUnknownTextMap(AhkSymbol, AhkTokenList, paramMap, valMap);
    const v: TDAMeta = {
        paramMap,
        valMap,
        textMap,
        funcRawName: AhkSymbol.name,
        range: AhkSymbol.range,
    };

    return wm.setWm(AhkSymbol, v);
}
