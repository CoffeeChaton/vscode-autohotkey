import * as vscode from 'vscode';
import { EMode } from '../../Enum/EMode';
import type { TTokenStream } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { docCommentBlock, EDocBlock } from '../str/inCommentBlock';

function getReturnText(lStr: string, textRaw: string, col: number): string {
    const name: string = textRaw
        // eslint-disable-next-line no-magic-numbers
        .slice(col + 6) // "Return".len
        .replace(/^[\s,]+/ui, '')
        .trim();

    if (name === '') return '';

    const comment: string = textRaw.length > lStr.length
        ? textRaw.slice(lStr.length)
        : '';

    // func
    const Func: RegExpMatchArray | null = name.match(/^(\w+)\(/u);
    if (Func !== null) {
        return `    Return ${Func[1]}(...) ${comment}`;
    }

    // obj
    if (name.includes('{') && name.includes(':')) {
        const returnObj: RegExpMatchArray | null = name.match(/^(\{\s*\w+\s*:\s*\S{0,20})/u);
        if (returnObj !== null) {
            return `    Return ${returnObj[1].trim()} ${comment}`;
        }
    }

    // too long
    const maxLen = 30;
    if (name.length > maxLen) {
        return `    Return ${name.slice(0, maxLen)} ... ${comment}`;
    }
    // else
    return `    Return ${name.trim()} ${comment}`;
}

// eslint-disable-next-line max-lines-per-function
export function getFuncDocCore(
    fileName: string,
    AhkTokenList: TTokenStream,
    selectionRangeText: string,
    classStack: string[],
): vscode.MarkdownString {
    let flag: EDocBlock = EDocBlock.other;
    const fnDocList: string[] = [];
    const returnList: string[] = [];

    for (const AhkTokenLine of AhkTokenList) {
        const {
            detail,
            textRaw,
            lStr,
            fistWordUp,
            fistWordUpCol,
            SecondWordUp,
            SecondWordUpCol,
        } = AhkTokenLine;

        if (detail.includes(EDetail.inComment) || flag === EDocBlock.inDocCommentBlockEnd) {
            const textRawTrim: string = textRaw.trimStart(); // **** MD ****** sensitive of \s && \n
            flag = docCommentBlock(textRawTrim, flag);
            if (
                flag === EDocBlock.inDocCommentBlockMid
                && (textRawTrim.startsWith('*') || textRawTrim.startsWith(';'))
            ) {
                // allow '*' and ';'
                fnDocList.push(textRawTrim.slice(1)); // **** MD ****** sensitive of \s && \n
            }
            continue;
        }

        if (fistWordUp === 'RETURN') {
            returnList.push(getReturnText(lStr, textRaw, fistWordUpCol));
        } else if (SecondWordUp === 'RETURN') {
            returnList.push(getReturnText(lStr, textRaw, SecondWordUpCol));
            // eslint-disable-next-line no-magic-numbers
        } else if (lStr.length > 8) { // "Return A".len
            const col: number = lStr.search(/\bReturn\b/ui);
            if (col !== -1) {
                returnList.push(getReturnText(lStr, textRaw, col));
            }
        }
    }

    //
    const kindStr: string = classStack.length === 0
        ? EMode.ahkFunc
        : EMode.ahkMethod;

    const classStackStr: string = classStack.length === 0
        ? ''
        : `class ${classStack.join('.')}\n\n`;

    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown(`(${kindStr})     of     ${fileName}\n`)
        .appendMarkdown(classStackStr)
        .appendCodeblock(selectionRangeText, 'ahk')
        .appendCodeblock(returnList.filter((s: string): boolean => s !== '').join('\n'), 'ahk')
        .appendCodeblock('}', 'ahk');

    if (fnDocList.length > 0) {
        md.appendMarkdown('\n\n***\n\n')
            .appendMarkdown(fnDocList.join('\n')); // **** MD ****** sensitive of \s && \n
    }

    md.supportHtml = true;

    return md;
}
