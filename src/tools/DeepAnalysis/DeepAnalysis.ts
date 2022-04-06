import * as vscode from 'vscode';
import { TAhkSymbolList, TGValMap, TTokenStream } from '../../globalEnum';
import { getFnMeta } from './getFnMeta';
import { TDAMeta } from './TypeFnMeta';

// FIXME:  GValMap
export function DeepAnalysis(AhkSymbolList: TAhkSymbolList, DocStrMap: TTokenStream, GValMap: TGValMap): TDAMeta[] {
    const funcMetaList: TDAMeta[] = [];
    for (const AhkSymbol of AhkSymbolList) {
        if (AhkSymbol.kind === vscode.SymbolKind.Class) {
            funcMetaList.push(...DeepAnalysis(AhkSymbol.children, DocStrMap, GValMap));
            continue;
        }
        const DA: TDAMeta | null = getFnMeta(AhkSymbol, DocStrMap, GValMap);
        if (DA !== null) funcMetaList.push(DA);
    }

    return funcMetaList;
}
