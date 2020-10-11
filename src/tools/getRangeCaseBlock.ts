import * as vscode from 'vscode';
import { getRange } from './getRange';
import { TDocArr } from '../globalEnum';
import { getRangeOfLine } from './getRangeOfLine';

export function getRangeCaseBlock(DocStrMap: TDocArr, defLine: number, searchLine: number, RangeEnd: number, lStr: string): vscode.Range {
    if (lStr.replace(/{\s*$/, '').trimEnd().endsWith(':') === false) {
        return getRangeOfLine(DocStrMap, defLine);
    }
    const startPos: vscode.Position = new vscode.Position(defLine, 0);
    const nextLine = searchLine + 1;
    let Resolved = -1;
    for (let line = nextLine; line <= RangeEnd; line += 1) {
        if (line < Resolved) continue;

        const textFix = DocStrMap[line].lStr.trim();
        if (textFix === '') continue;

        if ((/^switch\b/i).test(textFix)) {
            const SwitchRange = getRange(DocStrMap, line, line, RangeEnd);
            Resolved = SwitchRange.end.line;
            //       console.log(line, `line, SwitchRange Resolved -> ${Resolved}`, Resolved);
            continue;
        }
        if ((/^case\b\s*/i).test(textFix) || (/^default\b\s*:/i).test(textFix)) {
            return new vscode.Range(startPos, new vscode.Position(line - 1, 0));
        }
    }
    return new vscode.Range(startPos, new vscode.Position(RangeEnd, 0));
}
