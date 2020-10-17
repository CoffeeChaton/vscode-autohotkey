/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/no-type-alias */
import * as vscode from 'vscode';
import { TDocArr, DeepReadonly, MyDocSymbol } from '../globalEnum';

export type FuncInputType = DeepReadonly<{
    lStr: string,
    line: number,
    RangeEndLine: number,
    inClass: boolean,
    DocStrMap: TDocArr,
    Uri: vscode.Uri,
}>;

export type FuncLimit = (FuncInput: FuncInputType) => false | MyDocSymbol;

type ChildType = DeepReadonly<{
    inClass: boolean,
    fnList: FuncLimit[],
    RangeStartLine: number,
    RangeEndLine: number,
    Uri: vscode.Uri,
    DocStrMap: TDocArr,
}>;

export function getChildren(child: ChildType): Readonly<MyDocSymbol[]> {
    const {
        Uri, DocStrMap, RangeStartLine, RangeEndLine, inClass, fnList,
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
            });
            if (DocumentSymbol !== false) {
                result.push(DocumentSymbol);
                Resolved = DocumentSymbol.range.end.line;
                continue;
            }
        }
    }
    return result;
}
