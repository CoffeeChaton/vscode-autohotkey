/* eslint-disable no-await-in-loop */
import * as vscode from 'vscode';
import { EStr } from '../../globalEnum';

export function getStartWithStr(document: vscode.TextDocument, position: vscode.Position): string {
    // eslint-disable-next-line security/detect-unsafe-regex
    const Range = document.getWordRangeAtPosition(position, /(?<![.`])\b\w+\b/u);
    if (Range === undefined) return EStr.neverStr; // exp: . / []

    return document.getText(Range);
}
