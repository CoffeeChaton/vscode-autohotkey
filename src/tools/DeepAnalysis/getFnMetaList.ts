import * as vscode from 'vscode';
import { TAhkSymbolList, TTokenStream } from '../../globalEnum';
import { ClassWm } from '../wm';
import { getFnMeta } from './getFnMeta';
import { TDAMeta } from './TypeFnMeta';

// eslint-disable-next-line no-magic-numbers
const hr2: number = 2 * 60 * 60 * 1000;
const wm = new ClassWm<TAhkSymbolList, TDAMeta[]>(hr2, 'getFnMetaList', 0);

/**
 * @EXP const DAList : TDeepAnalysisMeta[] = getFnMetaList(AhkSymbolList, DocStrMap)
 */
export function getFnMetaList(AhkSymbolList: TAhkSymbolList, DocStrMap: TTokenStream): TDAMeta[] {
    // const DAList : TDeepAnalysisMeta[] = getFnMetaList(AhkSymbolList, DocStrMap)
    const cache: undefined | TDAMeta[] = wm.getWm(AhkSymbolList);
    if (cache !== undefined) return cache;

    const funcMetaList: TDAMeta[] = [];
    for (const AhkSymbol of AhkSymbolList) {
        if (AhkSymbol.kind === vscode.SymbolKind.Class) {
            funcMetaList.push(...getFnMetaList(AhkSymbol.children, DocStrMap));
            continue;
        }
        const DA: TDAMeta | null = getFnMeta(AhkSymbol, DocStrMap);
        if (DA !== null) funcMetaList.push(DA);
    }

    return wm.setWm(AhkSymbolList, funcMetaList);
}
