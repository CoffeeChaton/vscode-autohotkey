/* eslint-disable max-depth */
/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4,5] }] */
import type * as vscode from 'vscode';
import type { TAhkTokenLine, TTokenStream } from '../globalEnum';
import type { TGValMap } from './ParserTools/ahkGlobalDef';

export type TFuncInput = Readonly<{
    AhkTokenLine: TAhkTokenLine,
    //
    defStack: string[],
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
    RangeEndLine: number,
    uri: vscode.Uri,
}>;

type ChildType = Readonly<{
    defStack: string[],
    DocStrMap: TTokenStream,
    GValMap: TGValMap,
    RangeEndLine: number,
    RangeStartLine: number,
    uri: vscode.Uri,
}>;

type TChildrenType<T extends vscode.DocumentSymbol> = T['children'][number];

export const enum EFatherName {
    ARoot = 0,
    AClass = 1,
    AFunc = 2,
    ASwitch = 3,
    ACase = 4,
    ADefautl = 5,
}

export function getChildren<T extends vscode.DocumentSymbol>(
    fnList: ((FuncInput: TFuncInput) => TChildrenType<T> | null)[],
    child: ChildType,
    fatherName: EFatherName, // Root / vscode.DocumentSymbol.kind
): TChildrenType<T>[] {
    const {
        DocStrMap,
        RangeStartLine,
        RangeEndLine,
        defStack,
        GValMap,
        uri,
    } = child;

    const result: TChildrenType<T>[] = [];
    const fixFnDefBug: boolean = fatherName === EFatherName.ARoot || fatherName === EFatherName.AClass; // can search fun-def-line
    let Resolved = RangeStartLine; // <--------------------------------
    for (let line = RangeStartLine; line < RangeEndLine; line++) {
        if (line < Resolved) continue; // <------------------------------------
        const AhkTokenLine: TAhkTokenLine = DocStrMap[line];

        for (const fn of fnList) {
            const DocumentSymbol: TChildrenType<T> | null = fn({
                AhkTokenLine,
                DocStrMap,
                RangeEndLine,
                defStack,
                GValMap,
                uri,
            });
            if (DocumentSymbol !== null) {
                result.push(DocumentSymbol);
                Resolved = DocumentSymbol.range.end.line; // <-----------------
                if (fixFnDefBug) {
                    if ((/^[ \t}]*\w+\(/u).test(DocStrMap[DocumentSymbol.range.end.line].textRaw)) {
                        Resolved--; // Happy case ....
                        // old case  -> Deep Analysis : 744 Symbol, function : 665 , method: 79
                        // -2 to fix -> Deep Analysis : 738 Symbol, function : 665 , method: 73
                        // console.log('OO', DocumentSymbol.range.end.line, DocStrMap[DocumentSymbol.range.end.line].textRaw);
                    } else {
                        // console.log('XX', DocumentSymbol.range.end.line, DocStrMap[DocumentSymbol.range.end.line].textRaw);
                    }
                }

                break;
            }
        }
    }
    return result;
}
