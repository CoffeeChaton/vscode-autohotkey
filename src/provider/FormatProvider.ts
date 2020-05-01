/* eslint max-classes-per-file: ["error", 3] */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
/* eslint max-statements: [1, 200] */

import * as vscode from 'vscode';
import { removeSpecialChar2 } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
    const endLine = document.lineCount - 1;
    return new vscode.Range(0, 0, endLine, document.lineAt(endLine).text.length);
}
/* TODO https://code.visualstudio.com/api/references/vscode-api#OnEnterRule
        https://code.visualstudio.com/api/references/vscode-api#LanguageConfiguration
*/
function trimContent(text: string): string {
    let textFix = text.toLowerCase();
    textFix = removeSpecialChar2(textFix);

    const TraditionAssignment = textFix.search(/^[\w%]\s*=/);
    if (TraditionAssignment > -1) textFix = '';

    const msgbox = textFix.search(/^\s*msgbox\b/i);
    if (msgbox > -1) textFix = textFix.substring(0, msgbox + 'msgbox'.length);

    const gui = textFix.search(/^\s*gui\b/i);
    if (gui > -1) textFix = textFix.substring(0, gui + 'gui'.length);

    return textFix;
}

export class FormatProvider implements vscode.DocumentFormattingEditProvider {
    private static readonly commandRegexps: readonly RegExp[] = [
        /\bifnotexist\b(.*)/,
        /\bifExist\b(.*)/i,
        /\bifWinActive\b(.*)/i,
        /\bifwinnotactive\b(.*)/,
        /\bifWinExist\b(.*)/i,
        /\bifWinNotExist\b(.*)/i,
        /\bifInString\b(.*)/i,
        /\bifnotinstring\b(.*)/,
        /\bif\b(.*)/,
        /\belse\b(.*)/,
        /\bloop\b(.*)/,
        /\bfor\b(.*)/,
        /\bwhile\b(.*)/,
        /\btry\b(.*)/,
        /\bcatch\b(.*)/,
    ];

    private static readonly ContinueLongLineRegex = /(?:^[,.?])|(?:^:[^:])|(?:^\+[^+])|(?:^-[^-])|(?:^and\b)|(?:^or\b)|(?:^\|\|)|(?:^&&)/;
    // [ContinueLongLine](https://www.autohotkey.com/docs/Scripts.htm#continuation)

    // eslint-disable-next-line class-methods-use-this
    public provideDocumentFormattingEdits(document: vscode.TextDocument,
        // eslint-disable-next-line no-unused-vars
        options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const { tabSize, insertSpaces } = options;
        const TabSpaces = insertSpaces ? ' ' : '\t';
        const tabSize2 = insertSpaces ? tabSize : 1;
        let formatDocument = '';
        let deep = 0;
        let oneCommandCode = 0;
        let CommentBlock = false;
        const lineMax = document.lineCount;
        for (let line = 0; line < lineMax; line += 1) {
            let notDeep = true;
            const { text } = document.lineAt(line);
            CommentBlock = inCommentBlock(text, CommentBlock);
            const textFix = CommentBlock ? '' : trimContent(text);
            /*
            if (text.match(/#ifwinactive$/) || text.match(/#ifwinnotactive$/) || (text.match(/\breturn\b/) && tagDeep === deep)) {
              deep -= 1;
              notDeep = false;
            }
            */
            const blockEnd = textFix.match(/}/g); // What does this block mean?
            if (blockEnd !== null) {
                let temp = blockEnd.length;
                const t2 = textFix.match(/{[^{}]*}/g);
                if (t2) {
                    temp -= t2.length;
                }
                deep -= temp;
                if (temp > 0) {
                    notDeep = false;
                }
            }
            /*
            if (text.match(/:$/)) {
              if (tagDeep > 0 && tagDeep === deep) {
                deep -= 1;
                notDeep = false;
              }
            }
            */
            const blockEnd2 = textFix.match(/{/g);
            if (oneCommandCode && blockEnd2 !== null) {
                if (blockEnd2) {
                    let temp = blockEnd2.length;
                    temp -= (textFix.match(/{[^{}]*}/g) || []).length;
                    if (temp > 0) {
                        oneCommandCode += (textFix.match(/\(/g) || []).length;
                        oneCommandCode -= (textFix.match(/\)/g) || []).length;
                        oneCommandCode -= 1;
                        deep -= 1;
                    }
                }
            }

            if (deep < 0) {
                deep = 0;
            }

            const thisLineDeep = textFix.trim().search(FormatProvider.ContinueLongLineRegex) > -1
                ? TabSpaces.repeat(tabSize2)
                : TabSpaces.repeat(0);
            const LineDeep = (oneCommandCode === 0) ? thisLineDeep : '';
            const LineBody = document.lineAt(line).text.trimStart();
            const Deep = TabSpaces.repeat(deep * tabSize2);
            // TODO += str
            formatDocument += Deep + LineDeep + LineBody;
            formatDocument += '\n';

            if (oneCommandCode) {
                oneCommandCode += (textFix.match(/\(/g) || []).length;
                oneCommandCode -= (textFix.match(/\)/g) || []).length;
                oneCommandCode -= 1;
                if (oneCommandCode < 0) {
                    oneCommandCode = 0;
                }
                deep -= 1;
            }
            /*
            if (text.match(/#ifwinactive.*?\s/) || text.match(/#ifwinnotactive.*?\s/)) {
              deep += 1;
              notDeep = false;
            }
            */
            const blockStart = textFix.match(/{/g);
            if (blockStart !== null) {
                let temp = blockStart.length;
                const t2 = textFix.match(/{[^{}]*}/g);
                if (t2) {
                    temp -= t2.length;
                }
                deep += temp;
                if (temp > 0) {
                    notDeep = false;
                }
            }
            /*
            if (text.match(/:$/)) { // label
              deep += 1;
              tagDeep = deep;
              notDeep = false;
            }
            */
            if (notDeep) {
                for (const commandRegexp of FormatProvider.commandRegexps) {
                    const temp = textFix.match(commandRegexp);
                    if (temp === null) continue;
                    oneCommandCode = 1;
                    oneCommandCode += (temp[1].match(/\(/g) || []).length;
                    oneCommandCode -= (temp[1].match(/\)/g) || []).length;
                    deep += 1;
                    break;
                }
            }
        }
        const result: vscode.TextEdit[] = [];
        result.push(new vscode.TextEdit(fullDocumentRange(document),
            formatDocument.replace(/\n{2,}/g, '\n\n')
                .replace(/\n*$/, '\n'))); // end line \n
        vscode.window.showInformationMessage('Format Document is Beta Test');
        return result;
    }
}
