/* eslint no-magic-numbers: ["error", { "ignore": [0,5] }] */
import * as vscode from 'vscode';
import {
    ESnippetRecBecause,
    TAhkSymbol,
    TSnippetRecMap,
    TValMap,
} from '../../../../globalEnum';

export function getContextRange(position: vscode.Position, ahkSymbol: TAhkSymbol): vscode.Range {
    const enum ERecLine {
        up = 5,
        down = 5,
    }
    const startLine: number = Math.max(position.line - ERecLine.up, ahkSymbol.range.start.line);
    const endLine: number = Math.min(position.line + ERecLine.down, ahkSymbol.range.end.line);

    return new vscode.Range(startLine, 0, endLine, 0);
}

export function setVarRec(Rec: TSnippetRecMap, valMap: TValMap, inputStr: string, contextRange: vscode.Range): void {
    for (const ValAnalysis of valMap.values()) {
        const { defRangeList, refRangeList, keyRawName } = ValAnalysis;

        if (keyRawName.startsWith(inputStr)) {
            Rec.set(keyRawName, ESnippetRecBecause.varStartWith);
            continue;
        }

        const defNear: vscode.Range | undefined = defRangeList.find((range) => contextRange.contains(range));
        if (defNear !== undefined) {
            Rec.set(keyRawName, ESnippetRecBecause.varDefNear);
            continue;
        }

        const refNear: vscode.Range | undefined = refRangeList.find((range) => contextRange.contains(range));
        if (refNear !== undefined) {
            Rec.set(keyRawName, ESnippetRecBecause.varRefNear);
        }
    }
}
