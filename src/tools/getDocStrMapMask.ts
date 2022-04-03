import { TAhkSymbol, TAhkToken, TTokenStream } from '../globalEnum';

export function getDocStrMapMask(AhkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TTokenStream {
    const startLine: number = AhkSymbol.range.start.line;
    const endLine: number = AhkSymbol.range.end.line;
    const AhkTokenList: TAhkToken = [];
    for (const e of DocStrMap) {
        if (e.line < startLine) continue;
        if (e.line > endLine) break;
        AhkTokenList.push(e);
    }
    return AhkTokenList;
}
