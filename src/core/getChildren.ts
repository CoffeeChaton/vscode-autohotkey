import * as vscode from 'vscode';
import { TTokenStream } from '../globalEnum';
import { TGValMap } from './ParserTools/ahkGlobalDef';

export type TFuncInput = Readonly<{
    fistWordUp: string;
    lStr: string;
    textRaw: string;
    line: number;
    RangeEndLine: number;
    defStack: string[];
    DocStrMap: TTokenStream;
    document: vscode.TextDocument;
    GValMap: TGValMap;
}>;

type ChildType = Readonly<{
    defStack: string[];
    RangeStartLine: number;
    RangeEndLine: number;
    DocStrMap: TTokenStream;
    document: vscode.TextDocument;
    GValMap: TGValMap;
}>;

type TChildrenType<T extends vscode.DocumentSymbol> = T['children'][number];

export function getChildren<T extends vscode.DocumentSymbol>(
    fnList: ((FuncInput: TFuncInput) => null | TChildrenType<T>)[],
    child: ChildType,
): TChildrenType<T>[] {
    const {
        DocStrMap,
        RangeStartLine,
        RangeEndLine,
        defStack,
        document,
        GValMap,
    } = child;

    const result: TChildrenType<T>[] = [];
    let Resolved = RangeStartLine; // <--------------------------------
    for (let line = RangeStartLine; line < RangeEndLine; line++) {
        if (line < Resolved) continue; // <------------------------------------
        const { lStr, fistWordUp, textRaw } = DocStrMap[line];
        for (const fn of fnList) {
            const DocumentSymbol: null | TChildrenType<T> = fn({
                fistWordUp,
                lStr,
                DocStrMap,
                line,
                RangeEndLine,
                defStack,
                document,
                GValMap,
                textRaw,
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
