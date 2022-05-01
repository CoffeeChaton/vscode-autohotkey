import * as vscode from 'vscode';

export function getStartWithStr(document: vscode.TextDocument, position: vscode.Position): string {
    // eslint-disable-next-line security/detect-unsafe-regex
    const Range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`#])\b\w+\b/u);
    if (Range === undefined) return ''; // exp: . / [] {} #

    return document.getText(Range);
}
