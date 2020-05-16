/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,10000] }] */

import * as vscode from 'vscode';
// import { Detecter } from '../core/Detecter';
import { tryGetSymbol } from './DefProvider';
import { removeSpecialChar, getSkipSign } from '../tools/removeSpecialChar';
import { inCommentBlock } from '../tools/inCommentBlock';
import { getHoverConfig } from '../configUI';
import { EMode } from '../tools/globalSet';
import { getFuncParm } from '../tools/getFuncParm';
// import { getFuncDef } from '../tools/getFuncDef';

const share = {
    getCommentText(text: string): string {
        const textFix = text.trimStart();
        return textFix.startsWith('@')
            ? `${textFix.substr(1)}   \n`
            : '';
    },

    getReturnText(textFix: string): string {
        const ReturnMatch = (/\breturn\b[\s,][\s,]*(.+)/i).exec(textFix);
        if (ReturnMatch === null) return '';

        let name = ReturnMatch[1].trim();
        const Func = (/^(\w\w*)\(/).exec(name);
        if (Func) {
            name = `${Func[1]}(...)`;
        } else {
            const returnObj = (/^(\{\s*\w\w*\s*:)/).exec(name);
            if (returnObj) name = `obj ${returnObj[1]}`;
        }
        return `Return ${name.trim()}  \n`;
    },

    async getHoverBody(word: string, mode: EMode): Promise<vscode.Hover | undefined> {
        const [AhkSymbol, Uri] = tryGetSymbol(word, mode);
        if (AhkSymbol === undefined || Uri === undefined) return undefined; //   console.log(JSON.stringify(hoverSymbol));
        // TODO if mode == EMode.ahkClass
        // --set start---
        const document = await vscode.workspace.openTextDocument(Uri);
        const HoverConfig = getHoverConfig();
        const showParmRaw = HoverConfig.showParm;
        const showCommentRaw = HoverConfig.showComment;
        const starLine = AhkSymbol.range.start.line;
        const endLine = AhkSymbol.range.end.line;
        // --set end---
        let commentBlock = false;
        let commentText = '';
        let returnList = '';
        for (let line = starLine; line < endLine; line += 1) {
            const textRaw = document.lineAt(line).text;
            const textFix = removeSpecialChar(textRaw).trim();
            if (getSkipSign(textFix)) continue;
            commentBlock = inCommentBlock(textFix, commentBlock);
            if (commentBlock) {
                commentText += showCommentRaw ? share.getCommentText(textRaw) : '';
                continue;
            }
            returnList += share.getReturnText(textFix);
        }

        const paramText = getFuncParm(document, AhkSymbol.range, showParmRaw);
        const HoverMd = (): vscode.Hover => {
            const kind = mode;
            // FIXME     const container = AhkSymbol.containerName; // || 'not container';
            const title = `(${kind})   ${AhkSymbol.detail}\n${AhkSymbol.name}(${paramText}){`;
            const commentText2 = commentText || 'not comment   \n';
            const commentText3 = showCommentRaw ? commentText2 : '';
            const returnList2 = returnList || 'void (this function not return value.)';
            return new vscode.Hover(new vscode.MarkdownString('', true).appendCodeblock(title, 'ahk')
                .appendMarkdown(commentText3).appendCodeblock(returnList2, 'ahk'));
        };
        return HoverMd();
    },
};

const HoverFunc = {
    async main(document: vscode.TextDocument, position: vscode.Position,
        word: string, textRaw: string): Promise<vscode.Hover | undefined> {
        const usingDef = new RegExp(`(?<!\\.)\\b(${word})\\(`, 'i'); // not search class.Method()
        if (textRaw.search(usingDef) === -1) return undefined;

        // FIXME *3------------
        // const isFuncDef = getFuncDef(document, position.line);
        // if (isFuncDef) {
        //     // FIXME *3
        //     const ahkSymbol = Detecter.getDocDefQuick(document.uri.fsPath, EMode.ahkAll);
        //     if (!ahkSymbol) return undefined;
        //     for (const ccc of ahkSymbol) {
        //         if (ccc.range.contains(position)) {
        //             if (ccc.kind === vscode.SymbolKind.Class) {
        //                 const mode = EMode.ahkMethod;
        //             }
        //         }
        //     }
        //     return undefined;
        // }
        //-------------
        const Hover = await share.getHoverBody(word, EMode.ahkFunc);
        if (Hover) return Hover;

        return undefined;
    },
};

// class HoverMethod {
//     public static async main(word: string, text: string): Promise<vscode.Hover | undefined> {
//         const usingDef = new RegExp(`\\b(${word})\\(`, 'i'); // search Method()
//         if (text.search(usingDef) === -1) return undefined;

//         const Hover = await share.getHoverBody(word, EMode.ahkMethod);
//         if (Hover) return Hover;

//         let line1 = 'Cannot find this Function defined of package,  \n';
//         line1 += 'if this Function is in standard library,  \n';
//         line1 += 'please use [ahk docs](https://www.autohotkey.com/docs/Functions.htm) to search';
//         return new vscode.Hover(new vscode.MarkdownString(line1, true));
//     }
// }

export class HoverProvider implements vscode.HoverProvider {
    // eslint-disable-next-line class-methods-use-this
    public async provideHover(document: vscode.TextDocument, position: vscode.Position,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): Promise<vscode.Hover | undefined> {
        const Range = document.getWordRangeAtPosition(position);
        if (Range === undefined) return undefined;
        const word = document.getText(Range).toLowerCase();

        // const isMethod = await HoverMethod.main(word, text);
        // if (isMethod) return isMethod;
        const textRaw = document.lineAt(position).text;
        const isFunc = await HoverFunc.main(document, position, word, textRaw);
        if (isFunc) return isFunc;

        // TODO https://www.autohotkey.com/docs/commands/index.htm
        // const commands = this.getCommandsHover(document, position);
        // if (commands) return commands;

        return undefined;
    }
}
