/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,5,6,7,8,9,10,60,1000] }] */
import * as vscode from 'vscode';
import { TAhkSymbol, TAhkSymbolRange } from '../../globalEnum';
import { enumErr } from '../enumErr';

function getArgsRange(document: vscode.TextDocument, ahkSymbol: TAhkSymbol): vscode.Range {
    const firstLineStr = document.getText(ahkSymbol.selectionRange).split('\n')[0];
    const character = Math.max(firstLineStr.indexOf('('), 0);
    const range = new vscode.Range(
        new vscode.Position(ahkSymbol.selectionRange.start.line, character),
        ahkSymbol.selectionRange.end,
    );
    return range;
}

function getBodyRange(ahkSymbol: TAhkSymbol): vscode.Range {
    const { range, selectionRange } = ahkSymbol;
    const bodyRange = new vscode.Range(selectionRange.end, range.end);
    return bodyRange;
}

function getFnRange(document: vscode.TextDocument, ahkSymbol: TAhkSymbol, Options: TAhkSymbolRange): vscode.Range {
    switch (Options) {
        case TAhkSymbolRange.argsRange: return getArgsRange(document, ahkSymbol);
        case TAhkSymbolRange.bodyRange: return getBodyRange(ahkSymbol);
        case TAhkSymbolRange.fullRange: return ahkSymbol.range;
        case TAhkSymbolRange.selectRange: return ahkSymbol.selectionRange;
        default: return enumErr(Options);
    }
}
