import * as vscode from 'vscode';
import { TGValMap } from '../../core/ParserTools/ahkGlobalDef';
import { pushToken, TSemanticTokensLeaf } from './tools';

function GlobalHighlightN3(GlobalValMap: TGValMap): TSemanticTokensLeaf[] {
    const need: TSemanticTokensLeaf[] = [];

    for (const GlobalVal of GlobalValMap.values()) {
        const { defRangeList, refRangeList } = GlobalVal;

        for (const range of defRangeList) {
            need.push({
                range,
                tokenType: 'variable',
                tokenModifiers: ['definition'],
            });
        }

        for (const range of refRangeList) {
            need.push({
                range,
                tokenType: 'variable',
                tokenModifiers: ['declaration'],
            });
        }
    }

    return need;
}

export function GlobalHighlight(GlobalValMap: TGValMap, Collector: vscode.SemanticTokensBuilder): void {
    pushToken(GlobalHighlightN3(GlobalValMap), Collector);
}
