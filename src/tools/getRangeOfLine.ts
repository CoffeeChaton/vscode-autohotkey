import * as vscode from 'vscode';
import { TTokenStream } from '../globalEnum';

export function getRangeOfLine(DocStrMap: TTokenStream, line: number): vscode.Range {
    return new vscode.Range(line, 0,
        line, DocStrMap[line].textRaw.length);
}
