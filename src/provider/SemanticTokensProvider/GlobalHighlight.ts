import * as vscode from 'vscode';
import { TGValMap } from '../../globalEnum';
import { pushToken, TSemanticTokensLeaf } from './tools';

function GlobalHighlightN3(GlobalValMap: TGValMap): TSemanticTokensLeaf[] {
    const need: TSemanticTokensLeaf[] = [];

    for (const GlobalVal of GlobalValMap.values()) {
        for (const { lRange } of GlobalVal) {
            const r1: TSemanticTokensLeaf = {
                range: lRange,
                tokenType: 'string', // just test
                tokenModifiers: [],
            };
            need.push(r1);
        }
    }

    return need;
}

export function GlobalHighlight(GlobalValMap: TGValMap, Collector: vscode.SemanticTokensBuilder): void {
    pushToken(GlobalHighlightN3(GlobalValMap), Collector);
}
