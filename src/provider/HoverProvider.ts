/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import { tryGetSymbol } from './DefProvider';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { getHoverConfig } from '../configUI';
import { EMode } from '../tools/globalSet';


class HoverFunc {
    public static async getFuncHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | null> {
        const { text } = document.lineAt(position);
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return null;
        const word = document.getText(Range).toLowerCase();
        const wordReg = new RegExp(`(?<!\\.)\\b(${word})\\(`, 'i'); // not search class.Method()
        if (text.search(wordReg) === -1) return null;

        const Hover = await HoverFunc.getFuncReturn(word);
        if (Hover) return Hover;

        let line1 = 'Cannot find the function defined of package,  \n';
        line1 += 'if this function is in standard library please use [ahk docs](https://www.autohotkey.com/docs/Functions.htm) to search';
        return new vscode.Hover(new vscode.MarkdownString(line1, true));
    }

    private static async getFuncReturn(word: string): Promise<vscode.Hover | null> {
        const AhkSymbol = await tryGetSymbol(word, EMode.ahkFunc);
        if (AhkSymbol === null) return null;
        //   console.log(JSON.stringify(hoverSymbol));
        const document = await vscode.workspace.openTextDocument(AhkSymbol.location.uri);
        let commentBlock = false;
        let commentText = '';
        let paramFlag = true;
        let paramText = '';
        let returnList = '';
        const { showParm, showComment } = getHoverConfig();
        const starLine = AhkSymbol.location.range.start.line;
        const endLine = AhkSymbol.location.range.end.line;
        for (let line = starLine; line <= endLine; line += 1) {
            const { text } = document.lineAt(line);
            const textFix = removeSpecialChar(text).trim();
            if (getSkipSign(textFix)) continue;
            commentBlock = inCommentBlock(textFix, commentBlock);
            if (showParm && paramFlag) {
                const { str, flag } = HoverFunc.getParamText(text, paramFlag, line, starLine);
                paramText += str;
                paramFlag = flag;
            }
            if (commentBlock) {
                commentText += showComment ? HoverFunc.getCommentText(text) : '';
                continue;
            }
            returnList += HoverFunc.getReturnText(textFix);
        }

        paramText = paramText || '()';
        const container = AhkSymbol.containerName || 'not container';
        const title = `kind: ${container}  \n${AhkSymbol.name}${paramText}`;
        commentText = commentText || 'not comment   \n';
        returnList = returnList || 'void (this function not return value.)';

        return new vscode.Hover(new vscode.MarkdownString('', true).appendCodeblock(title, 'ahk')
            .appendMarkdown(commentText).appendCodeblock(returnList, 'ahk'));
    }

    private static getParamText(text: string, paramFlag: boolean, line: number, starLine: number): { str: string, flag: boolean, } {
        const paramBlockFinish = /\)\s*\{$/;
        const paramBlockFinish2 = /^\{/;
        let str = text;
        const comment = str.lastIndexOf(';');
        if (comment > -1) str = str.substring(0, comment).trim();

        if (starLine === line) {
            const first = str.indexOf('(');
            if (first > -1) str = str.substr(first).trim();
        }
        const flag = (str.search(paramBlockFinish) > -1 || str.search(paramBlockFinish2) > -1)
            ? false : paramFlag; // at this block, paramFlag are always true.
        str = flag ? str : `${str}  \n`;
        return { str, flag };
    }

    private static getCommentText(text: string): string {
        const regexp = /^@/;
        const textFix = text.trimStart();
        if (textFix.search(regexp) === 0) {
            return `${textFix.substr(1)}   \n`;
        }
        return '';
    }

    private static getReturnText(textFix: string): string {
        const ReturnMatch = textFix.match(/\breturn\b[\s,][\s,]*(.+)/i);
        if (ReturnMatch) {
            let name = ReturnMatch[1].trim();
            const Func = name.match(/^(\w\w*)\(/);
            if (Func) {
                name = `${Func[1]}(...)`;
            } else {
                const returnObj = name.match(/^(\{\s*\w\w*\s*:)/);
                if (returnObj) name = `obj ${returnObj[1]}`;
            }
            return `Return ${name.trim()}  \n`;
        }
        return '';
    }
}

export default class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line class-methods-use-this
    async provideHover(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken) {
        const isFunc = await HoverFunc.getFuncHover(document, position);
        if (isFunc) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = this.getCommandsHover(document, position);
        // if (commands) return commands;

        return null;
    }
}
