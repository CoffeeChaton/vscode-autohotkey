import { TAhkSymbol, TGValMap, TTokenStream } from '../../globalEnum';
import { kindPick } from '../Func/kindPick';
import { getDocStrMapMask } from '../getDocStrMapMask';
import { getFnVarDef } from './FnVar/getFnVarDef';
import { getUnknownTextMap } from './getUnknownTextMap';
import { getParamDef } from './Param/getParamDef';
import {
    TDAMeta,
    TParamMap,
    TTextMap,
    TValMap,
} from './TypeFnMeta';

export function getFnMeta(AhkSymbol: TAhkSymbol, DocStrMap: TTokenStream, GValMap: TGValMap): null | TDAMeta {
    const kindStr: 'Function' | 'Method' | null = kindPick(AhkSymbol.kind);
    if (kindStr === null) return null;

    const AhkTokenList: TTokenStream = getDocStrMapMask(AhkSymbol, DocStrMap);

    const paramMap: TParamMap = getParamDef(AhkSymbol, AhkTokenList);
    const valMap: TValMap = getFnVarDef(AhkSymbol, AhkTokenList, paramMap);
    const textMap: TTextMap = getUnknownTextMap(AhkSymbol, AhkTokenList, paramMap, valMap, GValMap);
    const v: TDAMeta = {
        paramMap,
        valMap,
        textMap,
        funcRawName: AhkSymbol.name,
        range: AhkSymbol.range,
    };

    return v;
}
