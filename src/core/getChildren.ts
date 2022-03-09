import {
    TAhkSymbol,
    TAhkSymbolList,
    TGValMap,
    TTokenStream,
} from '../globalEnum';

export type FuncInputType = Readonly<{
    lStr: string;
    line: number;
    RangeEndLine: number;
    inClass: boolean;
    DocStrMap: TTokenStream;
    gValMapBySelf: TGValMap;
}>;

export type FuncLimit = (FuncInput: FuncInputType) => false | TAhkSymbol;

type ChildType = Readonly<{
    inClass: boolean;
    fnList: FuncLimit[];
    RangeStartLine: number;
    RangeEndLine: number;
    DocStrMap: TTokenStream;
    gValMapBySelf: TGValMap;
}>;

export function getChildren(child: ChildType): TAhkSymbolList {
    const {
        DocStrMap,
        RangeStartLine,
        RangeEndLine,
        inClass,
        fnList,
        gValMapBySelf,
    } = child;

    const result = [];
    let Resolved = -2;
    const iMax = fnList.length;
    for (let line = RangeStartLine; line < RangeEndLine; line++) {
        if (line < Resolved) continue;
        const { lStr } = DocStrMap[line];
        for (let i = 0; i < iMax; i++) {
            const DocumentSymbol: false | TAhkSymbol = fnList[i]({
                lStr,
                DocStrMap,
                line,
                RangeEndLine,
                inClass,
                gValMapBySelf,
            });
            if (DocumentSymbol !== false) {
                result.push(DocumentSymbol);
                Resolved = DocumentSymbol.range.end.line;
                break;
            }
        }
    }
    return result;
}
