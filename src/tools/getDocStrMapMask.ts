import { TAhkSymbol, TAhkToken, TTokenStream } from '../globalEnum';

function getDocStrMapMaskSlowMode(AhkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TTokenStream {
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

export function getDocStrMapMask(AhkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TTokenStream {
    if (DocStrMap[0].line === 0 && DocStrMap[DocStrMap.length - 1].line === (DocStrMap.length - 1)) {
        return DocStrMap.slice(AhkSymbol.range.start.line, AhkSymbol.range.end.line + 1);
    }
    console.log('🚀 ~ getDocStrMapMask ~ SlowMode, AhkSymbol is ', AhkSymbol);
    return getDocStrMapMaskSlowMode(AhkSymbol, DocStrMap);
}
