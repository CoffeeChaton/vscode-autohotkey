import * as vscode from 'vscode';
import { EMode } from '../../Enum/EMode';
import { TTokenStream } from '../../globalEnum';
import { docCommentBlock, EDocBlock } from '../str/inCommentBlock';

function getReturnText(lStr: string, textRaw: string, col: number): string {
    const name: string = textRaw
        .slice(col)
        .replace(/^\s*Return\b[\s,]+/ui, '')
        .trim();

    // func
    const Func: RegExpMatchArray | null = name.match(/^(\w+)\(/u);
    if (Func !== null) {
        const comment = textRaw.length > lStr.length
            ? textRaw.slice(lStr.length)
            : '';
        return `    Return ${Func[1]}(...) ${comment}`;
    }

    // obj
    if (name.includes('{') && name.includes(':')) {
        const returnObj: RegExpMatchArray | null = name.match(/^(\{\s*\w+\s*:\s*\S{0,20})/u);
        if (returnObj !== null) {
            return `    Return ${returnObj[1].trim()}`;
        }
    }

    // too long
    const maxLen = 30;
    if (name.length > maxLen) {
        return `    Return ${name.slice(0, maxLen)} ...`;
    }
    // else
    return `    Return ${name.trim()}`;
}

export function getFuncDocCore(
    fileName: string,
    AhkTokenList: TTokenStream,
    selectionRangeText: string,
    classStack: string[],
): vscode.MarkdownString {
    let flag: EDocBlock = EDocBlock.other;
    const fnDocList: string[] = [];
    const returnList: string[] = [];

    for (const { lStr, textRaw } of AhkTokenList) {
        const textRawTrim: string = textRaw.trimStart(); // **** MD ****** sensitive of \s && \n
        flag = docCommentBlock(textRawTrim, flag);
        if (flag === EDocBlock.inDocCommentBlockMid) {
            if (textRawTrim.startsWith('*') || textRawTrim.startsWith(';')) {
                // allow '*' and ';'
                const lineDoc: string = textRawTrim.slice(1); // **** MD ****** sensitive of \s && \n
                fnDocList.push(lineDoc);
            }
            continue;
        }

        // eslint-disable-next-line no-magic-numbers
        if (lStr.trim().length < 6) continue;

        const col: number = lStr.search(/\breturn\b[\s,]/ui);
        if (col !== -1) {
            returnList.push(getReturnText(lStr, textRaw, col));
        }
    }

    const kindStr: string = classStack.length === 0
        ? EMode.ahkFunc
        : EMode.ahkMethod;
    const kindDetail = `(${kindStr})     of     ${fileName}\n`;

    const classStackStr = classStack.length === 0
        ? ''
        : `class ${classStack.join('.')}\n\n`;

    const md: vscode.MarkdownString = new vscode.MarkdownString('', true)
        .appendMarkdown(kindDetail)
        .appendMarkdown(classStackStr)
        .appendCodeblock(selectionRangeText, 'ahk')
        .appendCodeblock(returnList.join('\n'), 'ahk')
        .appendCodeblock('}', 'ahk');

    const fnFullDoc: string = fnDocList.join('\n\n'); // **** MD ****** sensitive of \s && \n
    if (fnFullDoc.trim().length > 0) {
        md
            .appendMarkdown('\n\n***\n\n')
            .appendMarkdown(fnFullDoc);
    }

    md.supportHtml = true;

    return md;
}
