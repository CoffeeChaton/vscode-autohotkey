
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
import * as vscode from 'vscode';
// import { removeSpecialChar2, getSkipSign } from '../../tools/removeSpecialChar';
import { getRange } from '../../tools/getRange';

// Switch case
// #LTrim

export function getSwitchRange(document: vscode.TextDocument, textFix: string, line: number, RangeEnd: number): vscode.Range | undefined {
    if (textFix.search(/^switch\s/) === -1) return undefined;
    const lineFix = textFix.endsWith('{') ? line : line + 1;
    const range = getRange(document, lineFix, lineFix, RangeEnd);
    const PosStart = new vscode.Position(range.start.line, document.lineAt(range.start.line + 1).range.end.character);
    const PosEnd = new vscode.Position(range.end.line - 1, document.lineAt(range.end.line - 1).range.end.character)
    return new vscode.Range(PosStart, PosEnd);
}

export function inSwitchBlock(textFix: string, line: number, switchRangeArray: vscode.Range[]): number {
    const Pos = new vscode.Position(line, 0);
    let switchDeep = 0;
    for (const switchRange of switchRangeArray) {
        if (switchRange.contains(Pos)) {
            switchDeep += 1;
        }
    }

    if (textFix.search(/^case\s/) !== -1
        || textFix.search(/^default\s/) !== -1) {
        switchDeep -= 1;
    }
    return switchDeep;
}
