import * as vscode from 'vscode';
import { CAhkFunc } from '../../CAhkFunc';
import { TAhkSymbolList } from '../../TAhkSymbolIn';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { pushToken, TSemanticTokensLeaf } from './tools';

const wm: WeakMap<CAhkFunc, TSemanticTokensLeaf[]> = new WeakMap();

function DA2SemanticHighlight(DA: CAhkFunc): TSemanticTokensLeaf[] {
    const cache: TSemanticTokensLeaf[] | undefined = wm.get(DA);
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
    wm.set(DA, Tokens);
    return Tokens;
}

export function DAList2SemanticHighlightFull(
    AhkSymbolList: TAhkSymbolList,
    Collector: vscode.SemanticTokensBuilder,
): void {
    const DAList: CAhkFunc[] = getDAList(AhkSymbolList);
    for (const DA of DAList) {
        pushToken(DA2SemanticHighlight(DA), Collector);
    }
}
