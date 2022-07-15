import * as vscode from 'vscode';

export function isNormalPos(document: vscode.TextDocument, position: vscode.Position): boolean {
    const Range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`{}])\b\w+\b/u);
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
    return !['.', '`', '{', '}', '#'].includes(document.getText(newRange));
}
