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
// Switch case

function minZero(a: number): number {
    if (a > 0) return a;
    return 0;
}

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
        || (textFix.startsWith(':') && textFix.endsWith('::'))) { // `::btw::`
        return true;
    }
    return false;
}

function isReturn(tagDeep: number, deep: number, textFix: string): boolean {
    // FIXME use textRaw
    if (tagDeep === deep && textFix === 'return') return true;
    return false;
}

function thisLineDeep(textFix: string): 1 | 0 {
    // [ContinueLongLine](https://www.autohotkey.com/docs/Scripts.htm#continuation)
    const CLL = [
        /^[,.?]/,
        /^:[^:]/,
        /^\+[^+]/, // +
        /^-[^-]/, // -
        /^and\b/,
        /^or\b/,
        /^\|\|/,
        /^&&/,
        /^[!~&/<>|^]/,
        /^\*[^/]/, // *
        /^\//, // /
        /^new\b\s/,
        /^not\b\s/,
        // Don't do it /^%/,
    ];
    const iMax = CLL.length;
    for (let i = 0; i < iMax; i += 1) {
        if (CLL[i].test(textFix) && (textFix.includes('::') === false)) return 1;
        // Hotkeys && HotStrings has '::'
    }
    return 0;
}

function getOneCommandCode(textFix: string, oneCommandCode: number): number {
    const oneCommandCodeFix = minZero(oneCommandCode);
    const commandRegexps: readonly RegExp[] = [
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
    const commandRegexpsLength = commandRegexps.length;

    for (let j = 0; j < commandRegexpsLength; j += 1) {
        // eslint-disable-next-line no-continue
        if (textFix.search(commandRegexps[j]) > -1) {
            return textFix.endsWith('{')
                ? 0
                : oneCommandCodeFix + 1;
        }
        // break;
    }

    return (thisLineDeep(textFix) !== 0)
        ? oneCommandCodeFix // || 1
        : 0;
}

function getDeepLTrimStart(textFix: string, deepLTrim: number): number {
    if (textFix.startsWith(')')) return deepLTrim - 1;
    return deepLTrim;
}

function getDeepLTrimEnd(textFix: string, deepLTrim: number): number {
    if (textFix.startsWith('(')) return deepLTrim + 1;
    return deepLTrim;
}

export class FormatProvider implements vscode.DocumentFormattingEditProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const TabSpaces = options.insertSpaces ? ' ' : '\t';
        const tabSize2 = options.insertSpaces ? options.tabSize : 1;
        const thisLineTextWARN = (textFix: string, line: number, CommentBlock: boolean,
            // eslint-disable-next-line max-params
            oneCommandCode: number, deep: number, LTrim: boolean, deepLTrim: number): string => {
            if (LTrim) {
                return `${document.lineAt(line).text}`;
            }
            const LineBodyWARN = document.lineAt(line).text.trimStart();
            if (LineBodyWARN === '') {
                return LineBodyWARN;
            }

            const LineDeep: 0 | 1 = CommentBlock || (oneCommandCode !== 0)
                ? 0
                : thisLineDeep(textFix);
            const curlyBracketsChange: 0 | -1 = textFix.startsWith('{') || textFix.startsWith('}')
                ? -1
                : 0;
            const deepFix = minZero(deep + oneCommandCode + curlyBracketsChange + LineDeep + deepLTrim);

            const DeepStr = TabSpaces.repeat(deepFix * tabSize2);
            return `${DeepStr}${LineBodyWARN}`;
        };
        let fmtDocWARN = ''; // WARN TO USE THIS !!
        let deep = 0;
        let tagDeep = 0;
        let oneCommandCode = 0;
        let CommentBlock = false;
        let inLTrim = false; // ( LTrim
        let deepLTrim = 0; // ( LTrim
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
            let textFix = CommentBlock || getSkipSign(textRaw) ? '' : removeSpecialChar2(textRaw.toLowerCase()).trim();
            inLTrim = inLTrimRange(textRaw, inLTrim);
            if (inLTrim) textFix = '';

            if (isReturn(tagDeep, deep, textFix)// Return
                || Hashtag(textFix) // #if #hotstring
                || (tagDeep > 0 && tagDeep === deep && isLabelOrHotStr(textFix)) // label:
            ) {
                deep -= 1;
            }


            deepLTrim = getDeepLTrimEnd(textFix, deepLTrim);

            if (deep < 0) deep = 0;
            fmtDocWARN += thisLineTextWARN(textFix, line, CommentBlock, oneCommandCode, deep, inLTrim, deepLTrim);
            fmtDocWARN += '\n';
            // after

            deepLTrim = getDeepLTrimStart(textFix, deepLTrim);

            if (Hashtag(textFix)) { // #IF  #hotstring
                deep += 1;
                notDeep = false;
            }

            if (isLabelOrHotStr(textFix)) { // label:
                deep += 1;
                notDeep = false;
                tagDeep = deep;
            }

            deep += (textFix.match(/\{/g) || []).length - (textFix.match(/\}/g) || []).length;

            oneCommandCode = notDeep
                ? getOneCommandCode(textFix, oneCommandCode)
                : 0;
        }
        vscode.window.showInformationMessage('Format Document is Beta v0.2.5.1');

        fmtDocWARN = fmtDocWARN.replace(/\n{2,}/g, '\n\n')
            .replace(/\n*$/, '\n');// doc finish just need one \n
        return [
            new vscode.TextEdit(fullDocumentRange(document), fmtDocWARN),
        ];
    }
}
/*

```ahk
TEST OK
for k,v in Monitors
    if (v.Num = MonitorNum)
        return v

TEST NO
for k,v in Monitors
    for k,v in Monitors
        for k,v in Monitors
            if gg(){
                dddddd:=gggggg
                for k,v in Monitors
                    for k,v in Monitors
                        if dd()
                            bbb :=ddd()
            }
```
*/
