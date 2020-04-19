/* eslint-disable class-methods-use-this */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */

import * as vscode from 'vscode';
import DefProvider from './DefProvider';
// import { Detecter } from '../core/Detecter';
// import getLocation from '../tools/getLocation';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { getHoverShow } from '../configUI';


// eslint-disable-next-line no-unused-vars
const a: vscode.HoverProvider = {
    // eslint-disable-next-line no-unused-vars
    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
        return new vscode.Hover('Hello World');
    },
};

export default class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line no-unused-vars
    public async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const isFunc = await this.getFuncHover(document, position);
        if (isFunc) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = this.getCommandsHover(document, position);
        // if (commands) return commands;

        return new vscode.Hover('');
    }

    private async getFuncHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | null> {
        const { text } = document.lineAt(position);
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return null;
        const word = document.getText(Range).toLowerCase();
        const wordReg = new RegExp(`(?<!\\.)\\b(${word})\\(`, 'ig'); // not search class.Method()
        if (text.search(wordReg) === -1) return null;

        const Hover = await this.getFuncReturn(document, word);
        if (Hover) return Hover;

        let line1 = 'Cannot find the function defined of package,  \n';
        line1 += 'if this function is in standard library please use [ahk docs](https://www.autohotkey.com/docs/Functions.htm) to search';
        return new vscode.Hover(new vscode.MarkdownString(line1, true));
    }

    // eslint-disable-next-line max-statements
    private async getFuncReturn(tempDocument: vscode.TextDocument, word: string): Promise<vscode.Hover | null> {
        const Def = new DefProvider();
        const hoverSymbol = await Def.tryGetSymbol(tempDocument, word);
        if (hoverSymbol === null) return null;
        const document = await vscode.workspace.openTextDocument(hoverSymbol.location.uri);
        const container = hoverSymbol.containerName || 'not containerName';
        const title: string = `${container}  \n${hoverSymbol.name}`;
        let commentBlock = false;
        let commentText = '';
        let paramFlag = true;
        let paramText = '';
        let body = '';
        const { ShowParm, ShowComment } = getHoverShow();
        const iMax = hoverSymbol.location.range.end.line;
        let starLine = hoverSymbol.location.range.start.line;
        for (starLine; starLine <= iMax; starLine += 1) {
            const { text } = document.lineAt(starLine);
            const textFix = removeSpecialChar(text).trim();
            commentBlock = inCommentBlock(textFix, commentBlock);
            if (getSkipSign(textFix)) continue;
            if (ShowParm && paramFlag) {
                const temp = this.getParamText(textFix, paramFlag);
                paramText += temp.str2;
                paramFlag = temp.flag2;
            }
            if (commentBlock) {
                commentText += ShowComment ? this.getCommentText(text) : '';
                continue;
            }
            body += this.getReturnText(textFix);
        }
        if (body.trim() === '') body = 'void (this function while not return.)';
        commentText = commentText || 'not comment   \n';
        commentText = ShowComment ? commentText : '';
        paramText = paramText || '()';
        const md = new vscode.MarkdownString('', true).appendCodeblock(`${title}${paramText}`, 'ahk')
            .appendMarkdown(commentText).appendCodeblock(body, 'ahk');
        return new vscode.Hover(md);
    }

    private getParamText(textFix: string, paramFlag: boolean): { str2: string, flag2: boolean, } {
        const paramFinish = /\)\s*\{$/;
        const paramFinish2 = /^\{/;
        let textFix2 = textFix;
        const first = textFix2.indexOf('(');
        if (first > -1) textFix2 = textFix2.substring(first, textFix2.length);
        let str2 = textFix2;
        const flag2 = (textFix.search(paramFinish) > -1 || textFix.search(paramFinish2) > -1) ? false : paramFlag;
        str2 = flag2 ? str2 : `${str2}  \n`;
        return { str2, flag2 };
    }

    private getCommentText(text: string): string {
        const regexp = /^@/;
        if (text.trim().search(regexp) === 0) {
            return `${text.trim()}   \n`;
        }
        return '';
    }

    private getReturnText(textFix: string): string {
        const regexp1 = /\breturn\b[\s,][\s,]*./i;
        const ReturnMatch = textFix.match(regexp1);
        if (ReturnMatch) {
            return `${textFix.trim()}  \n`;
        }
        return '';
    }
}
