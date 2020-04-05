/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
/* eslint-disable no-continue */

// eslint-disable-next-line import/no-unresolved
import * as vscode from 'vscode';
import { trimContent } from './405trimContent';
import inCommentBlock from './405inCommentBlock';

// eslint-disable-next-line max-statements
export default function getSymbolEndLine(document: vscode.TextDocument,
  line: number, lineCount: number, startPos: vscode.Position): vscode.Range {
  const nextLine = line + 1;
  let CommentBlock = false;
  let block = 0;
  const blockStart = /\{$/;
  const blockEnd = /^\}/;

  for (let i = line; i < lineCount; i += 1) {
    const { text } = document.lineAt(i);
    CommentBlock = inCommentBlock(text, CommentBlock);
    if (CommentBlock) continue; // in /*  block
    const textFix = trimContent(text, false).trim();
    if (textFix === '') continue; // just ''

    const s = textFix.search(blockStart);// {$
    if (s > -1) block += 1;
    const e = textFix.search(blockEnd); // ^}
    if (e > -1) block -= 1;


    if (block === 0) {
      switch (i) {
        case line: break; // nothing, just break switch block, "{" may be at next like
        case nextLine: // can not find "{" at lineStart or lineStart++
          return new vscode.Range(startPos, new vscode.Position(nextLine, text.length));
        default:
          return new vscode.Range(startPos,
            new vscode.Position(i, text.indexOf('}')));
      }
    }
  }

  // I don't think it will run to the here
  const { text } = document.lineAt(nextLine);
  const temp = `Error line at ${nextLine} \n AHK OUTLINE ERROR getSymbolEndLine--48--83--81  \n  ${text} `;
  console.log(temp);
  // vscode.window.showWarningMessage(temp);
  // eslint-disable-next-line
  const endPos = new vscode.Position(nextLine, 0);
  return new vscode.Range(startPos, endPos);
}
