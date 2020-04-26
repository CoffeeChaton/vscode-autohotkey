/* eslint max-classes-per-file: ["error", 4] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
import { tryGetSymbol } from './DefProvider';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';
import { getHoverConfig } from '../configUI';
import { EMode } from '../tools/globalSet';
import getFuncParm from '../tools/getFuncParm';

class share {
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

    private static HoverMd(mode: EMode, paramText: string, commentText: string, showComment: boolean, returnList: string, AhkSymbol: vscode.SymbolInformation)
        : vscode.Hover {
        const kind = mode;
        const container = AhkSymbol.containerName; // || 'not container';
        const title = `(${kind})  ${container}  \n${AhkSymbol.name}(${paramText}){`;
        const commentText2 = commentText || 'not comment   \n';
        const commentText3 = showComment ? '' : commentText2;
        const returnList2 = returnList || 'void (this function not return value.)';
        return new vscode.Hover(new vscode.MarkdownString('', true).appendCodeblock(title, 'ahk')
            .appendMarkdown(commentText3).appendCodeblock(returnList2, 'ahk'));
    }

    public static async getHoverBody(word: string, mode: EMode): Promise<vscode.Hover | null> {
        const AhkSymbol = tryGetSymbol(word, mode);
        if (AhkSymbol === null) return null; //   console.log(JSON.stringify(hoverSymbol));
        // TODO *3 if mode == EMode.ahkClass
        const document = await vscode.workspace.openTextDocument(AhkSymbol.location.uri);
        let commentBlock = false;
        let commentText = '';
        let returnList = '';
        const { showParm, showComment } = getHoverConfig();
        const starLine = AhkSymbol.location.range.start.line;
        const endLine = AhkSymbol.location.range.end.line;
        for (let line = starLine; line <= endLine; line += 1) {
            const { text } = document.lineAt(line);
            const textFix = removeSpecialChar(text).trim();
            if (getSkipSign(textFix)) continue;
            commentBlock = inCommentBlock(textFix, commentBlock);
            if (commentBlock) {
                commentText += showComment ? share.getCommentText(text) : '';
                continue;
            }
            returnList += share.getReturnText(textFix);
        }
        const paramText = getFuncParm(document, AhkSymbol, showParm);
        return share.HoverMd(mode, paramText, commentText, showComment, returnList, AhkSymbol);
    }
}

class HoverFunc {
    public static async main(word: string, text: string): Promise<vscode.Hover | null> {
        const usingDef = new RegExp(`(?<!\\.)\\b(${word})\\(`, 'i'); // not search class.Method()
        if (text.search(usingDef) === -1) return null;

        const Hover = await share.getHoverBody(word, EMode.ahkFunc);
        if (Hover) return Hover;

        return null;
    }
}

class HoverMethod {
    public static async main(word: string, text: string): Promise<vscode.Hover | null> {
        const usingDef = new RegExp(`\\b(${word})\\(`, 'i'); // search Method()
        if (text.search(usingDef) === -1) return null;

        const Hover = await share.getHoverBody(word, EMode.ahkMethod);
        if (Hover) return Hover;

        let line1 = 'Cannot find this Function defined of package,  \n';
        line1 += 'if this Function is in standard library,  \n';
        line1 += 'please use [ahk docs](https://www.autohotkey.com/docs/Functions.htm) to search';
        return new vscode.Hover(new vscode.MarkdownString(line1, true));
    }
}

export default class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line class-methods-use-this
    async provideHover(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Hover | null> {
        const { text } = document.lineAt(position);
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return null;
        const word = document.getText(Range).toLowerCase();

        const isFunc = await HoverFunc.main(word, text);
        if (isFunc) return isFunc;

        const isMethod = await HoverMethod.main(word, text);
        if (isMethod) return isMethod;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = this.getCommandsHover(document, position);
        // if (commands) return commands;

        return null;
    }
}
