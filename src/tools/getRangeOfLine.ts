/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable security/detect-object-injection */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import { TDocArr } from '../globalEnum';

export function getRangeOfLine(DocStrMap: TDocArr, line: number): vscode.Range {
    return new vscode.Range(new vscode.Position(line, 0),
        new vscode.Position(line, DocStrMap[line].textRaw.length));
}
