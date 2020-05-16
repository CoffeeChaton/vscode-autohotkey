/* eslint-disable security/detect-object-injection */
/* eslint no-continue: "error" */
/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
import * as vscode from 'vscode';
import { removeSpecialChar2, getSkipSign } from '../tools/removeSpecialChar';
import { inCommentBlock } from '../tools/inCommentBlock';
import { inLTrimRange } from '../tools/inLTrimRange';

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

function Hashtag(textFix: string): ECS | null {
    const HashtagIfWin = /^#ifwin(?:not)?(?:active|exist)\b/;
    const HashtagIf = /^#if\b/;
    if (HashtagIfWin.test(textFix) || HashtagIf.test(textFix)) {
        return ECS.ifBlock; // https://www.autohotkey.com/docs/commands/_If.htm#Basic_Operation
    }
    const HashtagHotStr = /#hotstring\b/;
    if (HashtagHotStr.test(textFix)) {
        return ECS.HotStringBlock; // https://www.autohotkey.com/docs/commands/_Hotstring.htm
    }
    return null;
}

function isLabelOrHotStr(textFix: string): boolean {
    if ((/^(?!case)\s\s*\w*\w:$/).test(textFix) // `labe:` not `case 0:`
        || (textFix.startsWith(':') && textFix.endsWith('::'))) { // ex: ::btw::by the way
        return true;
    }
    return false;
}

function isReturn(tagDeep: number, deep: number, textFix: string): boolean {
    if (tagDeep === deep && textFix === 'return') return true;
    return false;
}

// function calcBlockRegex(textFix: string): number {
//     const BlockRegex = /{[^{}]*}/g;
//     return (textFix.match(BlockRegex) || []).length;
// }

export class FormatProvider implements vscode.DocumentFormattingEditProvider {
    private static readonly commandRegexps: readonly RegExp[] = [
        /\bif(?:msgbox)?\b/,
        /\belse\b/,
        /\bloop\b/,
        /\bfor\b/,
        /\bwhile\b/,
        /\bif(?:not)?exist\b/,
        /\bifwin(?:not)?(?:active|exist)\b/,
        /\bif(?:not)?(?:in)string\b/,
        /\bifmsgbox\b/,
        /\btry\b/,
        /\bcatch\b/,
        /\bswitch\b/,
    ];

    private static readonly ContinueLongLineRegex = /^(?:(?:[,.?:])|(?:\+[^+])|(?:-[^-])|(?:and\b)|(?:or\b)|(?:\|\|)|(?:&&))\s/;
    // [ContinueLongLine](https://www.autohotkey.com/docs/Scripts.htm#continuation)

    // eslint-disable-next-line class-methods-use-this
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const TabSpaces = options.insertSpaces ? ' ' : '\t';
        const tabSize2 = options.insertSpaces ? options.tabSize : 1;
        const thisLineText = (textFix: string, line: number, CommentBlock: boolean, oneCommandCode: number, deep: number, LTrim: boolean): string => {
            if (LTrim) return `${document.lineAt(line).text}`;
            const LineBody = document.lineAt(line).text.trimStart();
            if (LineBody === '') return '';
            const thisLineDeep = (): 1 | 0 => (textFix.search(FormatProvider.ContinueLongLineRegex) > -1
                ? 1
                : 0);
            const LineDeep = CommentBlock ? 0 : thisLineDeep();
            const curlyBracketsChange = textFix.startsWith('{') || textFix.startsWith('}')
                ? -1
                : 0;
            const deepFix = (deep + oneCommandCode + curlyBracketsChange + LineDeep) > -1
                ? (deep + oneCommandCode + curlyBracketsChange + LineDeep)
                : 0;
            const DeepStr = TabSpaces.repeat(deepFix * tabSize2);
            return `${DeepStr}${LineBody}`;
        };
        const commandRegexpsLength = FormatProvider.commandRegexps.length;
        const getOneCommandCode = (notDeep: boolean, textFix: string, oneCommandCode: number): number => {
            if (notDeep === false) return 0;
            for (let j = 0; j < commandRegexpsLength; j += 1) {
                // eslint-disable-next-line no-continue
                if (textFix.search(FormatProvider.commandRegexps[j]) > -1) {
                    return textFix.endsWith('{') ? 0 : oneCommandCode + 1;
                }
                // break;
            }
            return 0;
        };
        let formatDocument = '';
        let deep = 0;
        let tagDeep = 0;
        let oneCommandCode = 0;
        let CommentBlock = false;
        let inLTrim = false; // ( LTrim

        // const parentheses = [{ line: 0, deep: 0 }]; // ()
        // const squareBrackets = [{ line: 0, deep: 0 }]; // []
        // const curlyBrackets = [{ line: 0, deep: 0 }]; // {}
        // const nextLineDeep = [{ line: 0, deep: 0 }]; // if
        // const labeHashtag = [{ line: 0, deep: 0 }]; // ^#if #win
        // const labels = [{ line: 0, deep: 0 }]; // labe:$
        // const HotStr = [{ line: 0, deep: 0 }]; // ^::HotStr::
        const lineMax = document.lineCount;
        for (let line = 0; line < lineMax; line += 1) {
            let notDeep = true;
            const textRaw = document.lineAt(line).text;
            CommentBlock = inCommentBlock(textRaw, CommentBlock);
            let textFix = CommentBlock || getSkipSign(textRaw) ? '' : removeSpecialChar2(textRaw.trim().toLowerCase());
            inLTrim = inLTrimRange(textRaw, inLTrim);
            if (inLTrim) textFix = '';

            if (isReturn(tagDeep, deep, textFix)// Return
                || Hashtag(textFix) // #if #hotstring
                || (tagDeep > 0 && tagDeep === deep && isLabelOrHotStr(textFix)) // label:
            ) {
                deep -= 1;
            }

            if (deep < 0) deep = 0;
            formatDocument += thisLineText(textFix, line, CommentBlock, oneCommandCode, deep, inLTrim); // `${Deep}${LineDeep}${LineBody}\n`;
            formatDocument += '\n';
            // after
            if (Hashtag(textFix)) { // #IF  #hotstring
                deep += 1;
                notDeep = false;
            }

            if (isLabelOrHotStr(textFix)) { // label:
                deep += 1;
                tagDeep = deep;
                notDeep = false;
            }

            deep += (textFix.match(/\{/g) || []).length - (textFix.match(/\}/g) || []).length;

            oneCommandCode = getOneCommandCode(notDeep, textFix, oneCommandCode);
        }
        vscode.window.showInformationMessage('Format Document is Beta v0.2.5');

        formatDocument = formatDocument.replace(/\n{2,}/g, '\n\n')
            .replace(/\n*$/, '\n');// doc finish just need one \n
        return [
            new vscode.TextEdit(fullDocumentRange(document), formatDocument),
        ];
    }
}
