import * as vscode from 'vscode';
import { TDocArr } from '../globalEnum';

export function getRangeOfLine(DocStrMap: TDocArr, line: number): vscode.Range {
    return new vscode.Range(line, 0,
        line, DocStrMap[line].textRaw.length);
}
