import * as vscode from 'vscode';
import { EMode, TAhkSymbol, TTokenStream } from '../../globalEnum';
import { docCommentBlock, EDocBlock } from '../str/inCommentBlock';

function getReturnText(lStr: string, textRaw: string): string {
    const col: number = lStr.search(/\breturn\b[\s,]+.{1,20}/ui);
    if (col === -1) return '';

    const name: string = textRaw.substring(col).trim();

    const Func: RegExpMatchArray | null = name.match(/^(\w+)\(/u);
    if (Func !== null) {
        const fnName = `${Func[1]}(...)`;
        return `    ${fnName.trim()}\n`;
    }

    // if (name.indexOf('{') > -1 && name.indexOf(':') > -1) {
    //     const returnObj: RegExpMatchArray | null = name.match(/^(\{\s*\w+\s*:)/u);
    //     if (returnObj !== null) name = `obj ${returnObj[1]}`;
    // }
    return `    ${name.trim()}\n`;
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

    const kindDetail = `(${EMode.ahkFunc}) \n`;
    const title = `${document.getText(AhkSymbol.selectionRange)}{\n`; // TODO: io ?

    const md = new vscode.MarkdownString('', true)
        .appendCodeblock(kindDetail, 'ahk')
        .appendCodeblock(title, 'ahk')
        .appendCodeblock(returnList, 'ahk')
        .appendCodeblock('}\n\n', 'ahk')
        .appendMarkdown(fnDocList.join('\n'));

    md.supportHtml = true;

    return md;
}
