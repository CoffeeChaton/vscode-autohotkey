/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable security/detect-object-injection */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */
/* eslint max-params: ["error", 8] */

import * as vscode from 'vscode';
import { removeSpecialChar, getSkipSign } from './removeSpecialChar';
import { EMode } from '../globalEnum';
import { getHoverConfig } from '../configUI';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

function commentFix(commentText: string): string {
    return commentText
        ? `/*  \n  \n${commentText}  \n*/  \n`
        : '  \n'; // '/* not comment */  \n';
}

function getCommentText(textRaw: string): string {
    const textFix = textRaw.trimStart();
    return textFix.startsWith(';')
        ? `${textFix.substring(1)}  \n`
        : '';
}

function getReturnText(textFixNot2: string): string {
    const ReturnMatch = (/\breturn\b[\s,][\s,]*(.+)/i).exec(textFixNot2);
    if (ReturnMatch === null) return '';

    let name = ReturnMatch[1].trim();
    const Func = (/^(\w\w*)\(/).exec(name);
    if (Func) {
        name = `${Func[1]}(...)`;
    } else {
        const returnObj = (/^(\{\s*\w\w*\s*:)/).exec(name);
        if (returnObj) name = `obj ${returnObj[1]}`;
    }
    return `    Return ${name.trim()}\n`;
}

export function inCommentBlock2(textRaw: string, CommentBlock: boolean): boolean {
    // const textFix = textRaw.trimStart();
    // if (textFix.startsWith('/**')) return true;
    // if (textFix.startsWith('*/')) return false;
    if ((/\s*\/\*\*/).test(textRaw)) return true;
    if ((/\s*\*\//).test(textRaw)) return false;
    return CommentBlock;
}

export async function setFuncHoverMD(hasSymbol: {
    AhkSymbol: DeepReadonly<vscode.DocumentSymbol>;
    fsPath: string;
}): Promise<vscode.Hover> {
    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(hasSymbol.fsPath));
    const { showComment } = getHoverConfig();
    const starLine = hasSymbol.AhkSymbol.range.start.line;
    const endLine = hasSymbol.AhkSymbol.range.end.line;
    // --set end---

    let commentBlock = false;
    let commentText = '';
    let returnList = '';
    for (let line = starLine; line < endLine; line += 1) {
        const textRaw = document.lineAt(line).text;
        commentBlock = inCommentBlock2(textRaw, commentBlock);
        if (commentBlock) {
            commentText += showComment ? getCommentText(textRaw) : '';
            continue;
        }
        returnList += getReturnText(textRaw);
    }

    const kindDetail = `(${EMode.ahkFunc}) ${hasSymbol.AhkSymbol.detail}\n`;
    const title = document.getText(hasSymbol.AhkSymbol.selectionRange);
    console.log(': -------------------------------------------------------');
    console.log('functiongetReturnText -> selectionRange', hasSymbol.AhkSymbol.selectionRange);
    console.log(': -------------------------------------------------------');
    const commentText2 = showComment ? commentFix(commentText) : '';
    const md = new vscode.MarkdownString('', true)
        .appendCodeblock(kindDetail, 'ahk')
        .appendCodeblock(title, 'ahk')
        .appendMarkdown(commentText2)
        .appendCodeblock(returnList, 'ahk')
        .appendCodeblock('}\n', 'ahk');
    return new vscode.Hover(md);
}
