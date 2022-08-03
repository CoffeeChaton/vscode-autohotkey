import type { CAhkFunc as CAhkFunction } from '../../AhkSymbol/CAhkFunc';
import type { TAstRoot } from '../../AhkSymbol/TAhkSymbolIn';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import type { TSemanticTokensLeaf } from './tools';

function DA2SemanticHighlight(fn: CAhkFunction): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];
    const { paramMap, valMap } = fn;
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

export function DAList2SemanticHighlight(AstRoot: TAstRoot): TSemanticTokensLeaf[] {
    return getDAList(AstRoot)
        .flatMap((fn: CAhkFunction): TSemanticTokensLeaf[] => DA2SemanticHighlight(fn));
}
