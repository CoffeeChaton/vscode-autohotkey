import {
    TAhkSymbol,
    TAhkSymbolList,
    TTokenStream,
} from '../globalEnum';

export type FuncInputType = Readonly<{
    fistWord: string;
    lStr: string;
    line: number;
    RangeEndLine: number;
    inClass: boolean;
    DocStrMap: TTokenStream;
}>;

export type FuncLimit = (FuncInput: FuncInputType) => false | TAhkSymbol;

type ChildType = Readonly<{
    inClass: boolean;
    fnList: FuncLimit[];
    RangeStartLine: number;
    RangeEndLine: number;
    DocStrMap: TTokenStream;
}>;

export function getChildren(child: ChildType): TAhkSymbolList {
    const {
        DocStrMap,
        RangeStartLine,
        RangeEndLine,
        inClass,
        fnList,
    } = child;

    const result = [];
    let Resolved = -2;
    for (let line = RangeStartLine; line < RangeEndLine; line++) {
        if (line < Resolved) continue;
        const { lStr, fistWord } = DocStrMap[line];
        for (const fn of fnList) {
            const DocumentSymbol: false | TAhkSymbol = fn({
                fistWord,
                lStr,
                DocStrMap,
                line,
                RangeEndLine,
                inClass,
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
