/* eslint no-continue: "error" */
/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
import * as vscode from 'vscode';
import { removeSpecialChar2, getSkipSign } from '../tools/removeSpecialChar';
import inCommentBlock from '../tools/inCommentBlock';

//  TODO https://code.visualstudio.com/api/references/vscode-api#OnEnterRule
//         https://code.visualstudio.com/api/references/vscode-api#LanguageConfiguration
//         LTrim https://wyagd001.github.io/zh-cn/docs/Scripts.htm#continuation
// Switch case

const enum ECS { // EnumContextSensitive  --> ECS
    ifBlock = '#if',
    HotStringBlock = '#HotString',
}

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
    const endLine = document.lineCount - 1;
    return new vscode.Range(0, 0, endLine, document.lineAt(endLine).text.length);
}

const HashtagIfWin = /#IfWin(?:Not)?(?:Active|Exist)\b/i;
const HashtagIf = /#if\b/i;
const HashtagHotStr = /#HotString\b/i;
function contextSensitive(textFix: string): ECS | null {
    if (textFix.search(HashtagIfWin) > -1 || textFix.search(HashtagIf) > -1) {
        return ECS.ifBlock; // https://www.autohotkey.com/docs/commands/_If.htm#Basic_Operation
    }
    if (textFix.search(HashtagHotStr) > -1) {
        return ECS.HotStringBlock; // https://www.autohotkey.com/docs/commands/_Hotstring.htm
    }
    return null;
}

const RegExLabel = /^(?!case)\s\s*\w*\w:$/i; // `labe:` not `case 0:`
const RegExHotStr = /^:/i; // ex: ::btw::by the way
function isLabelOrHotStr(textFix: string): boolean {
    if (textFix.search(RegExLabel) > -1
        || textFix.search(RegExHotStr) > -1) {
        return true;
    }
    return false;
}

const RegExpReturn = /^return\b/i;
function isReturn(tagDeep: number, deep: number, textFix: string): boolean {
    if (tagDeep === deep && textFix.search(RegExpReturn) > -1) return true;
    return false;
}

function CommandCodeOffset(str: string): number {
    return (str.match(/\(/g) || []).length - (str.match(/\)/g) || []).length;
}

const BlockRegex = /{[^{}]*}/g;
function calcBlockRegex(textFix: string): number {
    return (textFix.match(BlockRegex) || []).length;
}

const LTrimRegex1 = /^\(/;
const LTrimRegex2 = /\bLTrim\b/i;
const LTrimRegex3 = /^\)/;
function inLTrimRange(textFix: string, LTrim: boolean): boolean {
    if (textFix.search(LTrimRegex1) === 0 && textFix.search(LTrimRegex2) === -1) {
        return true;
    }
    if (textFix.search(LTrimRegex3) === 0) {
        return false;
    }
    return LTrim;
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

    private static readonly ContinueLongLineRegex = /(?:^[,.?])|(?:^:[^:])|(?:^\+[^+])|(?:^-[^-])|(?:^and\b)|(?:^or\b)|(?:^\|\|)|(?:^&&)/i;
    // [ContinueLongLine](https://www.autohotkey.com/docs/Scripts.htm#continuation)

    // eslint-disable-next-line class-methods-use-this
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const TabSpaces = options.insertSpaces ? ' ' : '\t';
        const tabSize2 = options.insertSpaces ? options.tabSize : 1;
        const thisLineText = (line: number, textFix: string, oneCommandCode: number, deep: number, LTrim: boolean): string => {
            if (LTrim) return `${document.lineAt(line).text}\n`;
            const LineBody = document.lineAt(line).text.trimStart();
            if (LineBody === '') return '\n';
            const thisLineDeep = textFix.trim().search(FormatProvider.ContinueLongLineRegex) > -1
                ? TabSpaces.repeat(tabSize2)
                : TabSpaces.repeat(0);
            const LineDeep = (oneCommandCode === 0) ? thisLineDeep : '';
            const Deep = TabSpaces.repeat(deep * tabSize2);
            return `${Deep}${LineDeep}${LineBody}\n`;
        };
        let formatDocument = '';
        let deep = 0;
        let tagDeep = 0;
        let oneCommandCode = 0;
        let CommentBlock = false;
        let LTrim = false; // ( LTrim
        const lineMax = document.lineCount;
        for (let line = 0; line < lineMax; line += 1) {
            let notDeep = true;
            const textRaw = document.lineAt(line).text;
            CommentBlock = inCommentBlock(textRaw, CommentBlock);
            let textFix = CommentBlock || getSkipSign(textRaw) ? '' : removeSpecialChar2(textRaw.trim().toLowerCase());
            LTrim = inLTrimRange(textFix, LTrim);
            if (LTrim) textFix = '';

            if (contextSensitive(textFix) || isReturn(tagDeep, deep, textFix)) { //  #If
                deep -= 1;
                notDeep = false;
            }

            const blockEnd = textFix.match(/\}/g);
            if (blockEnd !== null) {
                const temp = blockEnd.length - calcBlockRegex(textFix);
                deep -= temp;
                if (temp > 0) notDeep = false;
            }

            if (tagDeep > 0 && tagDeep === deep && isLabelOrHotStr(textFix)) { // label:
                deep -= 1;
                notDeep = false;
            }

            if (oneCommandCode > 0) {
                const blockStart2 = textFix.match(/\{/g);
                if (blockStart2) {
                    const temp = blockStart2.length - (textFix.match(/{[^{}]*}/g) || []).length;
                    if (temp > 0) {
                        oneCommandCode += CommandCodeOffset(textFix);
                        oneCommandCode -= 1;
                        deep -= 1;
                    }
                }
            }
            // -----------
            if (deep < 0) deep = 0;
            formatDocument += thisLineText(line, textFix, oneCommandCode, deep, LTrim); // `${Deep}${LineDeep}${LineBody}\n`;
            if (oneCommandCode > 0) {
                oneCommandCode += CommandCodeOffset(textFix);
                oneCommandCode -= 1;
                if (oneCommandCode < 0) oneCommandCode = 0;
                deep -= 1;
            }
            // ++++++++++++++++++

            if (contextSensitive(textFix)) {
                deep += 1;
                notDeep = false;
            }

            const blockStart = textFix.match(/\{/g);
            if (blockStart !== null) {
                const temp = blockStart.length - calcBlockRegex(textFix);
                deep += temp;
                if (temp > 0) notDeep = false;
            }

            if (isLabelOrHotStr(textFix)) { // label
                deep += 1;
                tagDeep = deep;
                notDeep = false;
            }

            if (notDeep) {
                for (const commandRegexp of FormatProvider.commandRegexps) {
                    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
                    const temp = textFix.match(commandRegexp);
                    // eslint-disable-next-line no-continue
                    if (temp === null) continue;
                    oneCommandCode = 1;
                    oneCommandCode += CommandCodeOffset(temp[1]);
                    deep += 1;
                    break;
                }
            }
        }
        vscode.window.showInformationMessage('Format Document is Beta v0.2');

        formatDocument = formatDocument.replace(/\n{2,}/g, '\n\n');
        formatDocument = formatDocument.replace(/\n*$/, '\n');// doc finish just need one \n
        return [
            new vscode.TextEdit(fullDocumentRange(document), formatDocument),
        ];
    }
}
