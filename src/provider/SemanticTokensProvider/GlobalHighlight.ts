import type { TGValMapReadOnly } from '../../core/ParserTools/ahkGlobalDef';
import type { TSemanticTokensLeaf } from './tools';

export function GlobalHighlight(GValMap: TGValMapReadOnly): TSemanticTokensLeaf[] {
    const Tokens: TSemanticTokensLeaf[] = [];

    for (const { defRangeList, refRangeList } of GValMap.values()) {
        for (const range of [...defRangeList, ...refRangeList]) {
            Tokens.push({
                range,
                tokenType: 'variable',
                tokenModifiers: ['definition'],
            });
        }
    }

    return Tokens;
}
