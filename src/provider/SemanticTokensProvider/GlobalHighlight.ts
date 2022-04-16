import * as vscode from 'vscode';
import { TGValMapReadOnly } from '../../core/ParserTools/ahkGlobalDef';
import { pushToken, TSemanticTokensLeaf } from './tools';

function GlobalHighlightN3(GlobalValMap: TGValMapReadOnly): TSemanticTokensLeaf[] {
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

export function GlobalHighlight(GlobalValMap: TGValMapReadOnly, Collector: vscode.SemanticTokensBuilder): void {
    pushToken(GlobalHighlightN3(GlobalValMap), Collector);
}
