import * as vscode from 'vscode';
import { CAhkFuncSymbol, TAhkSymbolList } from '../../globalEnum';
import { ClassWm } from '../../tools/wm';
import { pushToken, TSemanticTokensLeaf } from './tools';

// eslint-disable-next-line no-magic-numbers
const wm: ClassWm<CAhkFuncSymbol, TSemanticTokensLeaf[]> = new ClassWm(10 * 60 * 1000, 'DA2SemanticHighlight', 0);

function DA2SemanticHighlight(DA: CAhkFuncSymbol): TSemanticTokensLeaf[] {
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
    AhkSymbolList: TAhkSymbolList,
    Collector: vscode.SemanticTokensBuilder,
): void {
    for (const DA of AhkSymbolList) {
        if (DA instanceof CAhkFuncSymbol) {
            pushToken(DA2SemanticHighlight(DA), Collector);
        } else if (DA.kind === vscode.SymbolKind.Class) {
            DAList2SemanticHighlightFull(DA.children, Collector);
        }
    }
}
