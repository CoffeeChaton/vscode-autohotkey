import * as vscode from 'vscode';
import {
    TDocArr, MyDocSymbol, MyDocSymbolArr, TGValMap,
} from '../globalEnum';

export type FuncInputType = Readonly<{
    lStr: string,
    line: number,
    RangeEndLine: number,
    inClass: boolean,
    DocStrMap: TDocArr,
    Uri: vscode.Uri,
    gValMapBySelf: TGValMap,
}>;

export type FuncLimit = (FuncInput: FuncInputType) => false | MyDocSymbol;

type ChildType = Readonly<{
    inClass: boolean,
    fnList: FuncLimit[],
    RangeStartLine: number,
    RangeEndLine: number,
    Uri: vscode.Uri,
    DocStrMap: TDocArr,
    gValMapBySelf: TGValMap,
}>;

export function getChildren(child: ChildType): MyDocSymbolArr {
    const {
        Uri, DocStrMap, RangeStartLine, RangeEndLine, inClass, fnList, gValMapBySelf,
    } = child;

    const result = [];
    let Resolved = -2;
    const iMax = fnList.length;
    for (let line = RangeStartLine; line < RangeEndLine; line++) {
        if (line < Resolved) continue;
        const lStr = DocStrMap[line].lStr;
        for (let i = 0; i < iMax; i++) {
            const DocumentSymbol: false | MyDocSymbol = fnList[i]({
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
