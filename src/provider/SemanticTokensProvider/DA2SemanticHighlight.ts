import {
    DeepAnalysisResult,
} from '../../globalEnum';
import { ClassWm } from '../../tools/wm';
import { TSemanticTokensLeaf } from './TypeEnum';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<DeepAnalysisResult, TSemanticTokensLeaf[]>(3 * 60 * 1000, 'DA2SemanticHighlight', 700);

export function DA2SemanticHighlight(
    DA: DeepAnalysisResult,
): TSemanticTokensLeaf[] {
    const cache: TSemanticTokensLeaf[] | undefined = wm.getWm(DA);
    if (cache) return cache;

    const Tokens: TSemanticTokensLeaf[] = [];
    for (const arg of DA.argMap.values()) {
        const { defRangeList, refRangeList } = arg;
        [...defRangeList, ...refRangeList].forEach((range) => {
            Tokens.push({
                range,
                tokenType: 'parameter', // <---------------
                tokenModifiers: [],
            });
        });
    }
    for (const val of DA.valMap.values()) {
        const { defRangeList, refRangeList } = val;
        [...defRangeList, ...refRangeList].forEach((range) => {
            Tokens.push({
                range,
                tokenType: 'variable', // <---------------
                tokenModifiers: [],
            });
        });
    }

    return wm.setWm(DA, Tokens);
}
