import * as vscode from 'vscode';
import { EMode } from '../../Enum/EMode';
import { TTokenStream } from '../../globalEnum';
import { docCommentBlock, EDocBlock } from '../str/inCommentBlock';

function getReturnText(lStr: string, textRaw: string): string {
    const col: number = lStr.search(/\breturn\b[\s,]+\S/ui);
    if (col === -1) return '';

    const name: string = textRaw
        .substring(col)
        .replace(/^\s*Return\b[\s,]+/ui, '')
        .trim();

    // func
    const Func: RegExpMatchArray | null = name.match(/^(\w+)\(/u);
    if (Func !== null) {
        return `    Return ${Func[1]}(...)}\n`;
    }

    // obj
    if (name.indexOf('{') > -1 && name.indexOf(':') > -1) {
        const returnObj: RegExpMatchArray | null = name.match(/^(\{\s*\w+\s*:\s*\S{0,20})/u);
        if (returnObj !== null) {
            return `    Return ${returnObj[1].trim()} ; (obj) ...\n`;
        }
    }

    // too long
    const maxLen = 30;
    if (name.length > maxLen) {
        return `    Return ${name.substring(0, maxLen)} ;...\n`;
    }
    // else
    return `    Return ${name.trim()}\n`;
}

export function getFuncDocCore(
    kind: vscode.SymbolKind.Method | vscode.SymbolKind.Function,
    fileName: string,
    AhkTokenList: TTokenStream,
    selectionRangeText: string,
    classStack: string[],
): vscode.MarkdownString {
    let flag: EDocBlock = EDocBlock.other;
    const fnDocList: string[] = [];
    let returnList = '';

    for (const { lStr, textRaw } of AhkTokenList) {
        const textRawTrim: string = textRaw.trimStart(); // **** MD ****** sensitive of \s && \n
        flag = docCommentBlock(textRawTrim, flag);
        if (flag === EDocBlock.inDocCommentBlockMid) {
            if (!textRawTrim.startsWith('*')) continue;

            const lineDoc: string = textRawTrim.substring(1); // **** MD ****** sensitive of \s && \n
            fnDocList.push(
                lineDoc.trim() === ''
                    ? '\n'
                    : lineDoc,
            );
            continue;
        }
        returnList += getReturnText(lStr, textRaw);
    }

    const kindStr: string = kind === vscode.SymbolKind.Function
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
        .appendCodeblock(returnList, 'ahk')
        .appendCodeblock('}', 'ahk');

    const fnFullDoc: string = fnDocList.join('\n'); // **** MD ****** sensitive of \s && \n
    if (fnFullDoc.trim().length > 0) {
        md
            .appendMarkdown('\n\n***\n\n')
            .appendMarkdown(fnFullDoc);
    }

    md.supportHtml = true;

    return md;
}
