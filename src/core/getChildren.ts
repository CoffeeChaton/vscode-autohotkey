import { TAhkSymbol, TAhkSymbolList, TTokenStream } from '../globalEnum';

export type TFuncInput = Readonly<{
    fistWordUp: string;
    lStr: string;
    line: number;
    RangeEndLine: number;
    inClass: boolean;
    DocStrMap: TTokenStream;
}>;

export type TFuncLimit = (FuncInput: TFuncInput) => null | TAhkSymbol;

type ChildType = Readonly<{
    inClass: boolean;
    fnList: TFuncLimit[];
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

    const result: TAhkSymbol[] = [];
    let Resolved = RangeStartLine; // <--------------------------------------------
    for (let line = RangeStartLine; line < RangeEndLine; line++) {
        if (line < Resolved) continue; // <------------------------------------
        const { lStr, fistWordUp } = DocStrMap[line];
        for (const fn of fnList) {
            const DocumentSymbol: null | TAhkSymbol = fn({
                fistWordUp,
                lStr,
                DocStrMap,
                line,
                RangeEndLine,
                inClass,
            });
            if (DocumentSymbol !== null) {
                result.push(DocumentSymbol);
                Resolved = DocumentSymbol.range.end.line; // <-----------------
                break;
            }
        }
    }
    return result;
}
