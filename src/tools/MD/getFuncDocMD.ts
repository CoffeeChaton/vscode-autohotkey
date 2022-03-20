import * as vscode from 'vscode';
import { EMode, TAhkSymbol, TTokenStream } from '../../globalEnum';
import { Pretreatment } from '../Pretreatment';
import { docCommentBlock, EDocBlock } from '../str/inCommentBlock';
import { ClassWm } from '../wm';

function getReturnText(lStr: string, textRaw: string): string {
    const col = lStr.search(/\breturn\b[\s,]+.+/ui);
    if (col === -1) return '';

    let name = textRaw.substring(col).trim();
    const Func = (/^(\w+)\(/u).exec(name);
    if (Func) {
        name = `${Func[1]}(...)`;
    } else if (name.indexOf('{') > -1 && name.indexOf(':') > -1) {
        const returnObj = (/^(\{\s*\w+\s*:)/u).exec(name);
        if (returnObj) name = `obj ${returnObj[1]}`;
    }
    return `    ${name.trim()}\n`;
}

function getFuncDocCore(
    AhkSymbol: TAhkSymbol,
    document: vscode.TextDocument,
): vscode.MarkdownString {
    let flag = EDocBlock.other;
    const fnDocList: string[] = [];
    let returnList = '';
    const startLineBaseZero = AhkSymbol.range.start.line;
    const DocStrMap: TTokenStream = Pretreatment(document.getText(AhkSymbol.range).split('\n'), startLineBaseZero);
    const starLine = 0;
    const endLine = DocStrMap.length;
    for (let line = starLine; line < endLine; line++) {
        const { textRaw } = DocStrMap[line];
        flag = docCommentBlock(textRaw, flag);
        if (flag === EDocBlock.inDocCommentBlockMid) {
            const lineDoc = textRaw.trimStart().substring(1);
            fnDocList.push(
                lineDoc.trim() === ''
                    ? '\n'
                    : lineDoc,
            );
            continue;
        }
        returnList += getReturnText(DocStrMap[line].lStr, DocStrMap[line].textRaw);
    }

    const kindDetail = `(${EMode.ahkFunc}) ${AhkSymbol.detail}\n`;
    const title = `${document.getText(AhkSymbol.selectionRange)}{\n`;

    const md = new vscode.MarkdownString('', true)
        .appendCodeblock(kindDetail, 'ahk')
        .appendCodeblock(title, 'ahk')
        .appendCodeblock(returnList, 'ahk')
        .appendCodeblock('}\n\n', 'ahk')
        .appendMarkdown(fnDocList.join('\n'));

    md.supportHtml = true;

    return md;
}
// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TAhkSymbol, vscode.MarkdownString>(10 * 60 * 1000, 'setFuncHoverMD', 9000);

export async function getFuncDocMD(AhkSymbol: TAhkSymbol, fsPath: string): Promise<vscode.MarkdownString> {
    if (AhkSymbol.kind !== vscode.SymbolKind.Function && AhkSymbol.kind !== vscode.SymbolKind.Method) {
        return new vscode.MarkdownString('just support Function/Method hover now', true);
    }
    const cache = wm.getWm(AhkSymbol);
    if (cache) return cache;

    const document: vscode.TextDocument = await vscode.workspace.openTextDocument(vscode.Uri.file(fsPath));

    const md: vscode.MarkdownString = getFuncDocCore(AhkSymbol, document);

    return wm.setWm(AhkSymbol, md);
}
