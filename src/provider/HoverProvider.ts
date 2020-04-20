/* eslint-disable class-methods-use-this */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import DefProvider from './DefProvider';
// import { Detecter } from '../core/Detecter';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { getHoverConfig } from '../configUI';


export default class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line no-unused-vars
    async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
        const isFunc = await this.getFuncHover(document, position);
        if (isFunc) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = this.getCommandsHover(document, position);
        // if (commands) return commands;

        return null;
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
        //   console.log(JSON.stringify(hoverSymbol));
        const document = await vscode.workspace.openTextDocument(hoverSymbol.location.uri);
        let commentBlock = false;
        let commentText = '';
        let paramFlag = true;
        let paramText = '';
        let returnList = '';
        const { showParm, showComment } = getHoverConfig();
        const starLine = hoverSymbol.location.range.start.line;
        const endLine = hoverSymbol.location.range.end.line;
        for (let line = starLine; line <= endLine; line += 1) {
            const { text } = document.lineAt(line);
            const textFix = removeSpecialChar(text).trim();
            commentBlock = inCommentBlock(textFix, commentBlock);
            if (getSkipSign(textFix)) continue;
            if (showParm && paramFlag) {
                const { str, flag } = this.getParamText(text, paramFlag, line, starLine);
                paramText += str;
                paramFlag = flag;
            }
            if (commentBlock) {
                commentText += showComment ? this.getCommentText(text) : '';
                continue;
            }
            returnList += this.getReturnText(textFix);
        }

        paramText = paramText || '()';
        const container = hoverSymbol.containerName; // || 'not containerName';
        const title = `${container}  \n${hoverSymbol.name}${paramText}`;
        commentText = commentText || 'not comment   \n';
        returnList = returnList || 'void (this function does not return.)';

        return new vscode.Hover(new vscode.MarkdownString('', true).appendCodeblock(title, 'ahk')
            .appendMarkdown(commentText).appendCodeblock(returnList, 'ahk'));
    }

    private getParamText(text: string, paramFlag: boolean, line: number, starLine: number): { str: string, flag: boolean, } {
        const paramBlockFinish = /\)\s*\{$/;
        const paramBlockFinish2 = /^\{/;
        let str = text.trim();
        if (starLine === line) {
            const first = str.indexOf('(');
            if (first > -1) str = str.substring(first, str.length).trim();
        }
        const flag = (str.search(paramBlockFinish) > -1 || str.search(paramBlockFinish2) > -1)
            ? false : paramFlag; // at this block, paramFlag are always true.
        str = flag ? str : `${str}  \n`;
        return { str, flag };
    }

    private getCommentText(text: string): string {
        const regexp = /^[@-]/;
        if (text.trim().search(regexp) === 0) {
            return `${text.trim()}   \n`;
        }
        return '';
    }

    private static readonly regexArray: readonly RegExp[] = [
        /\breturn\b[\s,][\s,]*(.+)/i, // TODO /ig
        /^(\w\w*)\(/, // returnFunc
        /^(\{\s*\w\w*\s*:)/, // returnObj
    ]

    private getReturnText(textFix: string): string {
        const ReturnMatch = textFix.match(HoverProvider.regexArray[0]);
        if (ReturnMatch) {
            let name = ReturnMatch[1].trim();
            const returnFunc = name.match(HoverProvider.regexArray[1]);
            if (returnFunc) {
                name = `${returnFunc[1]}(...)`;
            } else {
                const returnObj = name.match(HoverProvider.regexArray[2]);
                if (returnObj) name = `obj ${returnObj[1]}`;
            }
            return `Return ${name.trim()}  \n`;
        }
        return '';
    }
}
