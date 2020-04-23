/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */

import * as vscode from 'vscode';
import { removeSpecialChar } from './removeSpecialChar';
import inCommentBlock from './inCommentBlock';

export default function getLocation(document: vscode.TextDocument,
    defLine: number, searchLine: number, lineCount: number): vscode.Location {
    const startPos: vscode.Position = new vscode.Position(defLine, 0);
    const blockStart = /\{$/;
    const blockEnd = /^\}/;
    const nextLine = searchLine + 1;
    let CommentBlock = false;
    let block = 0;
    for (let i = searchLine; i < lineCount; i += 1) {
        const { text } = document.lineAt(i);
        CommentBlock = inCommentBlock(text, CommentBlock);
        if (CommentBlock) continue;
        const textFix = removeSpecialChar(text).trim();
        if (textFix === '') continue;

        const s = textFix.search(blockStart);// {$
        if (s > -1) block += 1;
        const e = textFix.search(blockEnd); // ^}
        if (e > -1) block -= 1;

        if (block === 0) {
            switch (i) {
                case searchLine: // just break switch block, "{" may be at next like
                    break;
                case nextLine: // can not find "{" at lineStart or lineStart++
                    return new vscode.Location(document.uri, new vscode.Range(startPos, new vscode.Position(nextLine, text.length)));
                default: return new vscode.Location(document.uri, new vscode.Range(startPos, new vscode.Position(i, text.indexOf('}'))));
            }
        }
    }

    // const temp = `from line ${nextLine},miss a "{" or "}" at line_first or line_end.`;
    // vscode.window.showWarningMessage(temp);
    return new vscode.Location(document.uri, document.lineAt(searchLine).range);
}
