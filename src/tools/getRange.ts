/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import { removeSpecialChar2, getSkipSign } from './removeSpecialChar';
import { inCommentBlock } from './inCommentBlock';
import { inLTrimRange } from './inLTrimRange';

export function getRange(document: vscode.TextDocument, defLine: number, searchLine: number, RangeEnd: number): vscode.Range {
    const startPos: vscode.Position = new vscode.Position(defLine, 0);
    const blockStart = '{'; // /\{$/;
    const blockEnd = '}'; // /^\}/;
    const nextLine = searchLine + 1;
    let inLTrim: 0 | 1 | 2 = 0; // ( LTrim
    let CommentBlock = false;
    let block = 0;
    for (let line = searchLine; line <= RangeEnd; line += 1) {
        const textRaw = document.lineAt(line).text;
        CommentBlock = inCommentBlock(textRaw, CommentBlock);
        if (CommentBlock) continue;
        if (getSkipSign(textRaw)) continue;
        const textFix = removeSpecialChar2(textRaw).trim();
        if (textFix === '') continue;
        inLTrim = inLTrimRange(textRaw, inLTrim);
        if (inLTrim) continue;

        if (textFix.endsWith(blockStart)) block += 1; // {$
        if (textFix.startsWith(blockEnd)) block -= 1; // ^}

        if (block === 0) {
            switch (line) {
                case searchLine: // just break switch block, "{" may be at next like
                    break;
                case nextLine: // can not find "{" at lineStart or lineStart++
                    //   return new vscode.Range(startPos, new vscode.Position(nextLine, textRaw.length));
                    throw new Error('ERROR getRange nextLine--32--84--113--');
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
