/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,10000] }] */

import * as vscode from 'vscode';
import { removeSpecialChar2, getSkipSign } from './removeSpecialChar';
import { inCommentBlock } from './inCommentBlock';

export function getRange(document: vscode.TextDocument, defLine: number, searchLine: number, RangeEnd: number): vscode.Range {
    const startPos: vscode.Position = new vscode.Position(defLine, 0);
    const blockStart = '{'; // /\{$/;
    const blockEnd = '}'; // /^\}/;
    const nextLine = searchLine + 1;
    let CommentBlock = false;
    let block = 0;
    for (let line = searchLine; line <= RangeEnd; line += 1) {
        const textRaw = document.lineAt(line).text;
        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) continue;
        if (getSkipSign(textRaw)) continue;
        const textFix = removeSpecialChar2(textRaw).trim();
        if (textFix === '') continue;

        const s = textFix.endsWith(blockStart);// {$
        if (s) block += 1;
        const e = textFix.startsWith(blockEnd); // ^}
        if (e) block -= 1;

        if (block === 0) {
            switch (line) {
                case searchLine: // just break switch block, "{" may be at next like
                    break;
                case nextLine: // can not find "{" at lineStart or lineStart++
                    return new vscode.Range(startPos, new vscode.Position(nextLine, textRaw.length));
                default:

                    return new vscode.Range(startPos, new vscode.Position(line, textRaw.indexOf('}')));
            }
        }
    }
    const fsPathRaw = document.uri.fsPath;
    console.log(': ----getRange---ERROR----------------');
    console.log('fsPath', fsPathRaw);
    console.log('defLine', defLine);
    console.log('searchLine', searchLine);
    console.log('lineCount', RangeEnd);
    console.log(': ----getRange---ERROR---------------');
    return document.lineAt(searchLine).range;
}
