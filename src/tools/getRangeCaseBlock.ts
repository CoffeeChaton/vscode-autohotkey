import * as vscode from 'vscode';
import { getRange } from './getRange';
import { TDocArr } from '../globalEnum';
import { getRangeOfLine } from './getRangeOfLine';

export function getRangeCaseBlock(DocStrMap: TDocArr, defLine: number, searchLine: number, RangeEnd: number, lStr: string): vscode.Range {
    if ((/:\s*{\s*$/).test(lStr) === false) {
        // exp : case "cat": return "cat";
        // exp : case 3: do something;
        return getRangeOfLine(DocStrMap, defLine);
    }
    // exp : case "cat": {
    // exp : case 0:
    const startPos: vscode.Position = new vscode.Position(defLine, 0);
    const nextLine = searchLine + 1;
    let Resolved = -1;
    for (let line = nextLine; line <= RangeEnd; line += 1) {
        if (line < Resolved) continue;

        const lineLStr = DocStrMap[line].lStr;

        if ((/^\s*\bswitch\b/i).test(lineLStr)) {
            const SwitchRange = getRange(DocStrMap, line, line, RangeEnd);
            Resolved = SwitchRange.end.line;
            //       console.log(line, `line, SwitchRange Resolved -> ${Resolved}`, Resolved);
            continue;
        }
        if ((/^\s*\bcase\b\s*/i).test(lineLStr) || (/^\s*\bdefault\b\s*:/i).test(lineLStr)) {
            return new vscode.Range(startPos, new vscode.Position(line - 1, 0));
        }
    }
    return new vscode.Range(startPos, new vscode.Position(RangeEnd, 0));
}
