import { CAhkFunc as CAhkFunction } from '../../AhkSymbol/CAhkFunc';
import { TTopSymbol } from '../../AhkSymbol/TAhkSymbolIn';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { TSemanticTokensLeaf } from './tools';

function DA2SemanticHighlight(DA: CAhkFunction): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    const { paramMap, valMap } = DA;
    for (const { defRangeList, refRangeList } of paramMap.values()) {
        for (const range of [...defRangeList, ...refRangeList]) {
            Tokens.push({
                range,
                tokenType: 'parameter', // <---------------
                tokenModifiers: [],
            });
        }
    }
    for (const { defRangeList, refRangeList } of valMap.values()) {
        for (const range of [...defRangeList, ...refRangeList]) {
            Tokens.push({
                range,
                tokenType: 'variable', // <---------------
                tokenModifiers: [],
            });
        }
    }

    return Tokens;
}

export function DAList2SemanticHighlight(AhkSymbolList: readonly TTopSymbol[]): TSemanticTokensLeaf[] {
    return getDAList(AhkSymbolList)
        .flatMap((DA: CAhkFunction): TSemanticTokensLeaf[] => DA2SemanticHighlight(DA));
}
