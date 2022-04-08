import * as vscode from 'vscode';
import { EMode, TAhkSymbol, TTokenStream } from '../../globalEnum';
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
    AhkSymbol: TAhkSymbol,
    document: vscode.TextDocument,
    AhkTokenList: TTokenStream,
): vscode.MarkdownString {
    let flag: EDocBlock = EDocBlock.other;
    const fnDocList: string[] = [];
    let returnList = '';

    for (const { lStr, textRaw } of AhkTokenList) {
        flag = docCommentBlock(textRaw, flag);
        if (flag === EDocBlock.inDocCommentBlockMid) {
            // TODO ...start with '*' or ;
            const lineDoc: string = textRaw.trimStart().substring(1);
            fnDocList.push(
                lineDoc.trim() === ''
                    ? '\n'
                    : lineDoc,
            );
            continue;
        }
        returnList += getReturnText(lStr, textRaw);
    }

    const kindDetail = `(${EMode.ahkFunc}) of ${document.fileName}\n`;
    const title = `${document.getText(AhkSymbol.selectionRange)}{\n`; // TODO: remove document

    const md = new vscode.MarkdownString('', true)
        .appendCodeblock(kindDetail, 'ahk')
        .appendCodeblock(title, 'ahk')
        .appendCodeblock(returnList, 'ahk')
        .appendCodeblock('}\n\n', 'ahk')
        .appendMarkdown(fnDocList.join('\n'));

    md.supportHtml = true;

    return md;
}
