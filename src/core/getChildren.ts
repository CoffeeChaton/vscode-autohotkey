import * as vscode from 'vscode';
import { TAhkSymbol } from '../AhkSymbol/TAhkSymbolIn';
import { TTokenStream } from '../globalEnum';
import { TGValMap } from './ParserTools/ahkGlobalDef';

export type TFuncInput = Readonly<{
    fistWordUp: string;
    lStr: string;
    textRaw: string;
    line: number;
    RangeEndLine: number;
    classStack: string[];
    DocStrMap: TTokenStream;
    document: vscode.TextDocument;
    GValMap: TGValMap;
}>;

export type TFuncLimit = (FuncInput: TFuncInput) => null | TAhkSymbol;

type ChildType = Readonly<{
    classStack: string[];
    fnList: TFuncLimit[];
    RangeStartLine: number;
    RangeEndLine: number;
    DocStrMap: TTokenStream;
    document: vscode.TextDocument;
    GValMap: TGValMap;
}>;

// export type TAhkSymbol =
//     | TBaseCh // TODO: remove this
//     | CAhkClass
//     | CAhkClassGetSet
//     | CAhkClassInstanceVar
//     | CAhkComment
//     | CAhkFunc
//     | CAhkHotKeys
//     | CAhkHotString
//     | CAhkInclude
//     | CAhkLabel
//     | CAhkSwitch
//     | CAhkCase
//     | CAhkDefault;

export function getChildren(child: ChildType): TAhkSymbol[] {
    const {
        DocStrMap,
        RangeStartLine,
        RangeEndLine,
        classStack,
        fnList,
        document,
        GValMap,
    } = child;

    const result: TAhkSymbol[] = [];
    let Resolved = RangeStartLine; // <--------------------------------
    for (let line = RangeStartLine; line < RangeEndLine; line++) {
        if (line < Resolved) continue; // <------------------------------------
        const { lStr, fistWordUp, textRaw } = DocStrMap[line];
        for (const fn of fnList) {
            const DocumentSymbol: null | TAhkSymbol = fn({
                fistWordUp,
                lStr,
                DocStrMap,
                line,
                RangeEndLine,
                classStack,
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
