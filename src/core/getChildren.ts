import * as vscode from 'vscode';
import {
    TTokenStream, TAhkSymbol, TAhkSymbolList, TGValMap,
} from '../globalEnum';

export type FuncInputType = Readonly<{
    lStr: string,
    line: number,
    RangeEndLine: number,
    inClass: boolean,
    DocStrMap: TTokenStream,
    Uri: vscode.Uri,
    gValMapBySelf: TGValMap,
}>;

export type FuncLimit = (FuncInput: FuncInputType) => false | TAhkSymbol;

type ChildType = Readonly<{
    inClass: boolean,
    fnList: FuncLimit[],
    RangeStartLine: number,
    RangeEndLine: number,
    Uri: vscode.Uri,
    DocStrMap: TTokenStream,
    gValMapBySelf: TGValMap,
}>;

export function getChildren(child: ChildType): TAhkSymbolList {
    const {
        Uri, DocStrMap, RangeStartLine, RangeEndLine, inClass, fnList, gValMapBySelf,
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
                Uri,
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
