import * as vscode from 'vscode';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';

function getSearchLineFix(DocStrMap: TTokenStream, searchLine: number, RangeEnd: number): number {
    for (let line = searchLine; line < RangeEnd; line++) {
        if (DocStrMap[line].detail.includes(EDetail.deepAdd)) {
            return line;
        }
    }
    return RangeEnd;
}

export function getRange(DocStrMap: TTokenStream, defLine: number, searchLine: number, RangeEnd: number): vscode.Range {
    //  selectionRange must be contained in fullRange

    const searchLineFix = getSearchLineFix(DocStrMap, searchLine, RangeEnd);
    const startDeep = DocStrMap[searchLineFix].deep - 1;
    for (let line = searchLineFix + 1; line <= RangeEnd; line++) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (DocStrMap[line] === undefined) {
            console.error('🚀 ~ getRange ~ DocStrMap[line - 1].textRaw', DocStrMap[line - 1].textRaw);

            break;
        }
        if (DocStrMap[line].deep <= startDeep) {
            const col = DocStrMap[line].lStr.lastIndexOf('}');
            return new vscode.Range(defLine, 0, line, col);
        }
    }

    const errMsg: string = [
        `🚀 ~ startDeep${startDeep}`,
        '  DocStrMap[line].deep',
        'get Range ERROR Start --904--321--33 -------',
        `  textRaw: ${DocStrMap[searchLine].textRaw}`,
        `  defLine ${defLine}`,
        `  searchLineFix ${searchLineFix}`,
        `  startDeep ${startDeep}`,
        `  RangeEnd ${RangeEnd}`,
        'get Range ERROR END --904--321--33 -------',
    ].join('\n');
    console.error(errMsg);
    return new vscode.Range(defLine, 0, searchLine + 1, 0);
}
