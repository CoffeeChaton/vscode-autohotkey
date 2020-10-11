import * as vscode from 'vscode';
import { TDocArr } from '../globalEnum';

export function getRangeOfLine(DocStrMap: TDocArr, line: number): vscode.Range {
    return new vscode.Range(new vscode.Position(line, 0),
        new vscode.Position(line, DocStrMap[line].textRaw.length));
}
