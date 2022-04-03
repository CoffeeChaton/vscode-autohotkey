import { TAhkSymbolList, TTokenStream } from '../../globalEnum';
import { ClassWm } from '../wm';
import { getFnMeta } from './getFnMeta';
import { TDeepAnalysisMeta } from './TypeFnMeta';

// eslint-disable-next-line no-magic-numbers
const hr2: number = 2 * 60 * 60 * 1000;
const wm = new ClassWm<TAhkSymbolList, TDeepAnalysisMeta[]>(hr2, 'getFnMetaList', 0);

export function getFnMetaList(AhkSymbolList: TAhkSymbolList, DocStrMap: TTokenStream): TDeepAnalysisMeta[] {
    const cache: undefined | TDeepAnalysisMeta[] = wm.getWm(AhkSymbolList);
    if (cache !== undefined) return cache;

    // getFnMetaList(AhkSymbolList, DocStrMap)
    const funcMetaList: TDeepAnalysisMeta[] = [];
    for (const ahkSymbol of AhkSymbolList) {
        // if (ahkSymbol.kind === vscode.SymbolKind.Class) {
        //     funcMetaList.push(...AhkSymbolList2FnMetaList(ahkSymbol.children, DocStrMap));
        //     continue;
        // }
        const DA: TDeepAnalysisMeta | null = getFnMeta(ahkSymbol, DocStrMap);
        if (DA === null) continue;
        funcMetaList.push(DA);
    }

    return wm.setWm(AhkSymbolList, funcMetaList);
}
