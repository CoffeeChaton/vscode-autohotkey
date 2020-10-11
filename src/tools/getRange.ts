/* eslint-disable no-console */

import * as vscode from 'vscode';
import { TDocArr } from '../globalEnum';

function getSearchLineFix(DocStrMap: TDocArr, searchLine: number, RangeEnd: number): number {
    for (let line = searchLine; line < RangeEnd; line += 1) {
        const textFix = DocStrMap[line].lStr.trim();
        if (textFix.endsWith('{') || textFix.startsWith('{')) {
            return line;
        }
    }
    return RangeEnd;
}
export function getRange(DocStrMap: TDocArr, defLine: number, searchLine: number, RangeEnd: number): vscode.Range {
    //  selectionRange must be contained in fullRange
    const startPos: vscode.Position = new vscode.Position(defLine, 0);
    const lineMax = Math.min(RangeEnd, DocStrMap.length);
    const searchLineFix = getSearchLineFix(DocStrMap, searchLine, RangeEnd);
    const startDeep = DocStrMap[searchLineFix].deep - 1;
    for (let line = searchLineFix + 1; line <= lineMax; line += 1) {
        if (DocStrMap[line].deep === startDeep) {
            const col = DocStrMap[line].lStr.indexOf('}');
            const colFix = col === -1 ? DocStrMap[line].lStr.length : col;
            return new vscode.Range(startPos, new vscode.Position(line, colFix));
        }
    }
    //     const fsPathRaw = document.uri.fsPath;
    //     console.log(': ----getRange---ERROR----------------');
    //     console.log('fsPath', fsPathRaw);
    //     console.log('defLine', defLine);
    //     console.log('searchLine', searchLine);
    //     console.log('lineCount', RangeEnd);
    //     console.log(': ----getRange---ERROR---------------');
    //     return document.lineAt(searchLine).range;
    console.log('get Range ERROR at --904--321--33', RangeEnd);
    return new vscode.Range(startPos, new vscode.Position(lineMax - 1, 0));
}
