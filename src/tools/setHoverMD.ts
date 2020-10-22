import * as vscode from 'vscode';
import { EMode, MyDocSymbol } from '../globalEnum';
import { getHoverConfig } from '../configUI';
import { Pretreatment } from './Pretreatment';

function commentFix(commentText: string): string {
    return commentText !== ''
        ? `/**  \n  \n${commentText}  \n*/  \n`
        : '  \n'; // '/* not comment */  \n';
}

function getCommentText(textRaw: string): string {
    const textFix = textRaw.trimStart();
    return textFix.startsWith(';')
        ? `${textFix.substring(1)}  \n`
        : '';
}

function getReturnText(lStr: string, textRaw: string): string {
    const col = lStr.search(/\breturn\b[\s,][\s,]*.+/i);
    if (col === -1) return '';

    let name = textRaw.substring(col).trim();
    const Func = (/^(\w\w*)\(/).exec(name);
    if (Func) {
        name = `${Func[1]}(...)`;
    } else {
        const returnObj = (/^(\{\s*\w\w*\s*:)/).exec(name);
        if (returnObj) name = `obj ${returnObj[1]}`;
    }
    return `${name.trim()}\n`;
}

export function inCommentBlock2(textRaw: string, CommentBlock: boolean): boolean {
    if ((/\s*\/\*\*/).test(textRaw)) return true; // /**
    if ((/\s*\*\//).test(textRaw)) return false; // */
    return CommentBlock;
}

export async function setFuncHoverMD(hasSymbol: {
    AhkSymbol: MyDocSymbol;
    fsPath: string;
}): Promise<vscode.MarkdownString> {
    const document = await vscode.workspace.openTextDocument(vscode.Uri.file(hasSymbol.fsPath));
    const { showComment } = getHoverConfig();

    // --set end---

    let commentBlock = false;
    let commentText = '';
    let returnList = '';
    const DocStrMap = Pretreatment(document.getText(hasSymbol.AhkSymbol.range).split('\n'));
    const starLine = 0;
    const endLine = DocStrMap.length;
    for (let line = starLine; line < endLine; line += 1) {
        if (showComment) {
            const textRawF = DocStrMap[line].textRaw;
            commentBlock = inCommentBlock2(textRawF, commentBlock);
            if (commentBlock) {
                commentText += getCommentText(textRawF);
                continue;
            }
        }
        returnList += getReturnText(DocStrMap[line].lStr, DocStrMap[line].textRaw);
    }

    const kindDetail = `(${EMode.ahkFunc}) ${hasSymbol.AhkSymbol.detail}\n`;
    const title = document.getText(hasSymbol.AhkSymbol.selectionRange);

    const commentText2 = showComment ? commentFix(commentText) : '';
    const md = new vscode.MarkdownString('', true)
        .appendCodeblock(kindDetail, 'ahk')
        .appendCodeblock(title, 'ahk')
        .appendMarkdown(commentText2)
        .appendCodeblock(returnList, 'ahk')
        .appendCodeblock('}\n', 'ahk');
    return md;
}
