import * as vscode from 'vscode';
import { TTokenStream } from '../globalEnum';
import { getRange } from './getRange';
import { getRangeOfLine } from './getRangeOfLine';

export function getRangeCaseBlock(
    DocStrMap: TTokenStream,
    defLine: number,
    searchLine: number,
    RangeEnd: number,
    lStr: string,
): vscode.Range {
    if (!(/:\s*$/u).test(lStr)) {
        // exp : case "cat": return "cat";
        // exp : case 3: do something;
        return getRangeOfLine(DocStrMap, defLine);
    }
    // exp : case 0:\s*
    //          something at next line;
    const startPos: vscode.Position = new vscode.Position(defLine, 0);
    const nextLine = searchLine + 1;
    let Resolved = -1;
    for (let line = nextLine; line <= RangeEnd; line++) {
        if (line < Resolved) continue;

        const lineLStr = DocStrMap[line].lStr;

        if ((/^\s*\bswitch\b/ui).test(lineLStr)) {
            const SwitchRange = getRange(DocStrMap, line, line, RangeEnd);
            Resolved = SwitchRange.end.line;
            //       console.log(line, `line, Nested SwitchRange -> ${Resolved}`, Resolved);
            continue;
        }
        if (
            lineLStr.indexOf(':') !== -1
            && ((/^\s*\bcase\b\s*/ui).test(lineLStr) || (/^\s*\bdefault\b\s*:/ui).test(lineLStr))
        ) {
            const col = DocStrMap[line - 1].lStr.length;
            return new vscode.Range(startPos, new vscode.Position(line - 1, col));
        }
    }
    return new vscode.Range(startPos, new vscode.Position(RangeEnd, 0));
}
