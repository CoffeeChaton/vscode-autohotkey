import * as vscode from 'vscode';
import { TDocArr, DetailType } from '../globalEnum';

function getSearchLineFix(DocStrMap: TDocArr, searchLine: number, RangeEnd: number): number {
    for (let line = searchLine; line < RangeEnd; line++) {
        if (DocStrMap[line].detail.includes(DetailType.deepAdd)) {
            return line;
        }
    }
    return RangeEnd;
}
export function getRange(DocStrMap: TDocArr, defLine: number, searchLine: number, RangeEnd: number): vscode.Range {
    //  selectionRange must be contained in fullRange
    //  const startPos: vscode.Position = new vscode.Position(defLine, 0);
    // const lineMax = RangeEnd;// Math.min(RangeEnd, DocStrMap.length);
    const searchLineFix = getSearchLineFix(DocStrMap, searchLine, RangeEnd);
    const startDeep = DocStrMap[searchLineFix].deep - 1;
    for (let line = searchLineFix + 1; line <= RangeEnd; line++) {
        if (DocStrMap[line].deep === startDeep) {
            const col = DocStrMap[line].lStr.lastIndexOf('}');
            // const colFix = col === -1 ? DocStrMap[line].lStr.length : col;
            return new vscode.Range(defLine, 0, line, col);
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
    return new vscode.Range(defLine, 0, RangeEnd - 1, 0);
}
