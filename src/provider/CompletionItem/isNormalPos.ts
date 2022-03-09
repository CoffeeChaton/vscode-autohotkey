import * as vscode from 'vscode';

// eslint-disable-next-line security/detect-unsafe-regex
const regex = /(?<![.`{}])\b\w+\b/u;
const blockList = new Set<string>(['.', '`', '{', '}']);

export function isNormalPos(document: vscode.TextDocument, position: vscode.Position): boolean {
    const Range = document.getWordRangeAtPosition(position, regex);
    if (Range === undefined) {
        return false;
    }

    // at line start
    if (Range.start.character === 0) return true;

    const newRange: vscode.Range = new vscode.Range(
        Range.start.line,
        Range.start.character - 1,
        Range.start.line,
        Range.start.character,
    );
    const newStr: string = document.getText(newRange);
    return !blockList.has(newStr);
}
