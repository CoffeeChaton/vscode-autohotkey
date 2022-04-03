import * as vscode from 'vscode';
import { TAhkSymbolList, TTokenStream } from '../../globalEnum';
import { ClassWm } from '../wm';
import { getFnMeta } from './getFnMeta';
import { TDeepAnalysisMeta } from './TypeFnMeta';

// eslint-disable-next-line no-magic-numbers
const hr2: number = 2 * 60 * 60 * 1000;
const wm = new ClassWm<TAhkSymbolList, TDeepAnalysisMeta[]>(hr2, 'getFnMetaList', 0);

/**
 * @EXP const DAList : TDeepAnalysisMeta[] = getFnMetaList(AhkSymbolList, DocStrMap)
 */
export function getFnMetaList(AhkSymbolList: TAhkSymbolList, DocStrMap: TTokenStream): TDeepAnalysisMeta[] {
    // const DAList : TDeepAnalysisMeta[] = getFnMetaList(AhkSymbolList, DocStrMap)
    const cache: undefined | TDeepAnalysisMeta[] = wm.getWm(AhkSymbolList);
    if (cache !== undefined) return cache;

    const funcMetaList: TDeepAnalysisMeta[] = [];
    for (const ahkSymbol of AhkSymbolList) {
        if (ahkSymbol.kind === vscode.SymbolKind.Class) {
            funcMetaList.push(...getFnMetaList(ahkSymbol.children, DocStrMap));
            continue;
        }
        const DA: TDeepAnalysisMeta | null = getFnMeta(ahkSymbol, DocStrMap);
        if (DA !== null) funcMetaList.push(DA);
    }

    return wm.setWm(AhkSymbolList, funcMetaList);
}
