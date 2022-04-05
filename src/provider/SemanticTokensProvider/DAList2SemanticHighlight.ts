import * as vscode from 'vscode';
import { TAhkSymbolList, TTokenStream } from '../../globalEnum';
import { getFnMetaList } from '../../tools/DeepAnalysis/getFnMetaList';
import { TDAMeta } from '../../tools/DeepAnalysis/TypeFnMeta';
import { ClassWm } from '../../tools/wm';
import { pushToken, TSemanticTokensLeaf } from './tools';

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TDAMeta, TSemanticTokensLeaf[]>(10 * 60 * 1000, 'DA2SemanticHighlight', 0);

function DA2SemanticHighlight(DA: TDAMeta): TSemanticTokensLeaf[] {
    const cache: TSemanticTokensLeaf[] | undefined = wm.getWm(DA);
    if (cache !== undefined) return cache;

    const Tokens: TSemanticTokensLeaf[] = [];
    const { paramMap, valMap } = DA;
    for (const arg of paramMap.values()) {
        const { defRangeList, refRangeList } = arg;
        [...defRangeList, ...refRangeList].forEach((range) => {
            Tokens.push({
                range,
                tokenType: 'parameter', // <---------------
                tokenModifiers: [],
            });
        });
    }
    for (const val of valMap.values()) {
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

export function DAList2SemanticHighlightFull(
    DocStrMap: TTokenStream,
    AhkSymbolList: TAhkSymbolList,
    Collector: vscode.SemanticTokensBuilder,
): void {
    const DAList: TDAMeta[] = getFnMetaList(AhkSymbolList, DocStrMap);
    for (const DA of DAList) {
        pushToken(DA2SemanticHighlight(DA), Collector);
    }
}
