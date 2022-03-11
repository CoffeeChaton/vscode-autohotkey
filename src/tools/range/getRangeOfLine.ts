import * as vscode from 'vscode';
import { TTokenStream } from '../../globalEnum';

export function getRangeOfLine(DocStrMap: TTokenStream, line: number): vscode.Range {
    const col = DocStrMap[line].lStr.search(/\S/u);
    return new vscode.Range(
        line,
        col,
        line,
        DocStrMap[line].textRaw.length,
    );
}
