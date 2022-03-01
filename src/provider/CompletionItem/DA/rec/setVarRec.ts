/* eslint no-magic-numbers: ["error", { "ignore": [0,5] }] */
import * as vscode from 'vscode';
import {
    ESnippetRecBecause,
    TAhkSymbol,
    TSnippetRecMap,
    TValMap,
} from '../../../../globalEnum';

const enum ERecLine {
    up = 5,
    down = 5,
}

export function getContextRange(position: vscode.Position, ahkSymbol: TAhkSymbol): vscode.Range {
    const startLine = Math.max(position.line - ERecLine.up, ahkSymbol.range.start.line);
    const endLine = Math.min(position.line + ERecLine.down, ahkSymbol.range.end.line);

    return new vscode.Range(startLine, 0, endLine, 0);
}

export function setVarRec(Rec: TSnippetRecMap, valMap: TValMap, inputStr: string, contextRange: vscode.Range): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_upName, ValAnalysis] of valMap) {
        const { defLocList, refLocList, keyRawName } = ValAnalysis;

        if (keyRawName.startsWith(inputStr)) {
            Rec.set(keyRawName, ESnippetRecBecause.varStartWith);
            continue;
        }

        const defNear = defLocList.find((loc) => contextRange.contains(loc.range));
        if (defNear) {
            Rec.set(keyRawName, ESnippetRecBecause.varDefNear);
            continue;
        }

        const refNear = refLocList.find((loc) => contextRange.contains(loc.range));
        if (refNear) {
            Rec.set(keyRawName, ESnippetRecBecause.varRefNear);
        }
    }
}
