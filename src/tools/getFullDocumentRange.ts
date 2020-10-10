/* eslint no-magic-numbers: ["error", { "ignore": [0,1] }] */
import * as vscode from 'vscode';

export function getFullDocumentRange(document: vscode.TextDocument): vscode.Range {
    const endLine = document.lineCount - 1;
    return new vscode.Range(0, 0, endLine, document.lineAt(endLine).text.length);
}
