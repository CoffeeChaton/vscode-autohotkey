/* eslint-disable class-methods-use-this */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */

import * as vscode from 'vscode';
import DefProvider from './DefProvider';
// import { Detecter } from '../core/Detecter';
// import getLocation from '../tools/getLocation';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
// import { showTimeSpend } from '../configUI';


export default class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line no-unused-vars
    public async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const { text } = document.lineAt(position);
        const word = document.getText(document.getWordRangeAtPosition(position)).toLowerCase();
        const wordReg = new RegExp(`(?<!\\.)\\b(${word})\\(`, 'ig'); // not search class.Method()
        if (text.search(wordReg) === -1) return new vscode.Hover('this is not function');

        const Def = new DefProvider();
        const Symbol = await Def.tryGetSymbol(document, word);
        if (Symbol) {
            const temp = await this.getFuncReturn(Symbol);
            return temp;
        }

        let line1 = 'Cannot find the function defined of package,  \n';
        line1 += 'if this function is BuiltIn please use [ahk docs](https://www.autohotkey.com/docs/Functions.htm) to search';
        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // TODO hover MarkdownString color
        return new vscode.Hover(new vscode.MarkdownString(line1, true));
    }

    // eslint-disable-next-line max-statements
    private async getFuncReturn(Symbol: vscode.SymbolInformation) {
        const document = await vscode.workspace.openTextDocument(Symbol.location.uri);
        const iMax = Symbol.location.range.end.line;
        const markdownLineBreaks = '  \n';
        const regexp4 = /^[@^,\-+]/;
        const regexp3 = /^(\{\s*\w\w*\s*:)/;
        const regexp2 = /^(\w\w*)\(/;
        const regexp = /\breturn\b[\s,][\s,]*(.+)/i;
        const title: string = `**${Symbol.name}**  \n ${Symbol.containerName}  \n`;
        let CommentBlock = false;
        let head = '\n';
        let body = '\n';
        for (let { line } = Symbol.location.range.start; line <= iMax; line += 1) {
            const { text } = document.lineAt(line);
            CommentBlock = inCommentBlock(text, CommentBlock);
            const textFix = removeSpecialChar(text).trim();
            if (textFix === '') continue;
            if (getSkipSign(textFix)) continue;
            if (CommentBlock) {
                if (textFix.search(regexp4) === 0) {
                    head += `${textFix}${markdownLineBreaks}`;
                }
                continue;
            }
            const ReturnVal = textFix.match(regexp);
            if (ReturnVal) {
                let name = ReturnVal[1].trim();
                const Func = name.match(regexp2);
                if (Func) name = `${Func[1]}()`;
                const obj = name.match(regexp3);
                if (obj) name = `ahk obj ${obj[1]}`;
                body += `*   Return ${name.trim()}${markdownLineBreaks}`;
            }
        }
        if (body.trim() === '') body = 'void (this function while not return.)';
        return new vscode.Hover(new vscode.MarkdownString(`${title}${markdownLineBreaks}${head}\n---\n${body}`, true));
    }
}
