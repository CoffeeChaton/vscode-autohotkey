/* eslint no-continue: "error" */
/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */
import * as vscode from 'vscode';
import { removeSpecialChar2, getSkipSign } from '../tools/removeSpecialChar';
import { inCommentBlock } from '../tools/inCommentBlock';
import { inLTrimRange } from '../tools/inLTrimRange';
import { getSwitchRange, inSwitchBlock } from './fmtTools/SwitchCase';
import { hasDoubleSemicolon } from './fmtTools/hasDoubleSemicolon';
import { thisLineDeep } from './fmtTools/thisLineDeep';
import { getDeepKeywords } from './fmtTools/getDeepKeywords';
import { getDeepLTrim } from './fmtTools/getDeepLTrim';
import { isLabelOrHotStr } from './fmtTools/isLabelOrHotStr';
//  TODO https://code.visualstudio.com/api/references/vscode-api#OnEnterRule
//         https://code.visualstudio.com/api/references/vscode-api#LanguageConfiguration

const enum ECS { // EnumContextSensitive  --> ECS
    ifBlock = '#if',
    HotStringBlock = '#HotString',
}

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
    const endLine = document.lineCount - 1;
    return new vscode.Range(0, 0, endLine, document.lineAt(endLine).text.length);
}

function Hashtag(textFix: string): ECS | false {
    const HashtagIfWin = /^#ifwin(?:not)?(?:active|exist)\b/;
    const HashtagIf = /^#if\b/;
    if (HashtagIfWin.test(textFix) || HashtagIf.test(textFix)) {
        return ECS.ifBlock; // https://www.autohotkey.com/docs/commands/_If.htm#Basic_Operation
    }
    const HashtagHotStr = /^#hotstring\b/;
    if (HashtagHotStr.test(textFix)) {
        return ECS.HotStringBlock; // https://www.autohotkey.com/docs/commands/_Hotstring.htm
    }
    return false;
}

function isReturn(tagDeep: number, deep: number, textRaw: string): boolean {
    return (tagDeep === deep && textRaw.trim().toLowerCase() === 'return');
}

function calcDeep(textFix: string): number {
    let block = 0;
    if (textFix.endsWith('{')) block += 1; // {$
    if (textFix.startsWith('}')) block -= 1; // ^}
    return block;
}

export class FormatProvider implements vscode.DocumentFormattingEditProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const timeStart = Date.now();
        const TabSpaces = options.insertSpaces ? ' ' : '\t';
        const TabSize = options.insertSpaces ? options.tabSize : 1;
        const WARN_thisLineText_WARN = (textFix: string, line: number, CommentBlock: boolean,
            oneCommandCode: number, deep: number, inLTrim: 0 | 1 | 2, textRaw: string, switchRangeArray: vscode.Range[]): string => {
            if (inLTrim === 1 && textRaw.trim().startsWith('(') === false) {
                return `${document.lineAt(line).text}`;
            }
            const WARN_LineBody_WARN = document.lineAt(line).text.trimStart();
            if (WARN_LineBody_WARN === '') {
                return WARN_LineBody_WARN;
            }
            const switchDeep = inSwitchBlock(textFix, line, switchRangeArray);
            const LineDeep: 0 | 1 = CommentBlock || (oneCommandCode !== 0)
                ? 0
                : thisLineDeep(textFix);
            const curlyBracketsChange: 0 | -1 = textFix.startsWith('}') || (oneCommandCode > 0 && textFix.startsWith('{'))
                ? -1
                : 0;
            const deepFix = Math.max(deep + oneCommandCode + curlyBracketsChange + LineDeep + switchDeep + getDeepLTrim(inLTrim, textRaw), 0);

            const DeepStr = TabSpaces.repeat(deepFix * TabSize);
            return `${DeepStr}${WARN_LineBody_WARN}`;
        };
        let WARN_fmtDoc_WARN = ''; // WARN TO USE THIS !!
        let deep = 0;
        let tagDeep = 0;
        let deepKeywords = 0;
        let CommentBlock = false;
        let inLTrim: 0 | 1 | 2 = 0; // ( LTrim
        const switchRangeArray: vscode.Range[] = [];
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
            inLTrim = inLTrimRange(textRaw, inLTrim);
            const textFix = CommentBlock || getSkipSign(textRaw) || inLTrim > 0 ? '' : removeSpecialChar2(textRaw).trim().toLowerCase();

            if (isReturn(tagDeep, deep, textRaw)// Return
                || Hashtag(textFix) // #if #hotstring
                || (tagDeep > 0 && tagDeep === deep && isLabelOrHotStr(textFix)) // `label:` or `::btw::\n`
            ) {
                deep -= 1;
            }

            if (deep < 0) deep = 0;
            WARN_fmtDoc_WARN += WARN_thisLineText_WARN(textFix, line, CommentBlock, deepKeywords, deep, inLTrim, textRaw, switchRangeArray);
            WARN_fmtDoc_WARN += '\n';
            // after

            const switchRange = getSwitchRange(document, textFix, line, lineMax);
            if (switchRange) switchRangeArray.push(switchRange);

            if (Hashtag(textFix)) { // #IF  #hotstring
                deep += 1;
                notDeep = false;
            }

            if (isLabelOrHotStr(textFix)) { // label:
                deep += 1;
                notDeep = false;
                tagDeep = deep;
            }

            deep += hasDoubleSemicolon(textFix)
                ? 0
                : calcDeep(textFix);

            deepKeywords = notDeep
                ? getDeepKeywords(textFix, deepKeywords)
                : 0; // TODO fmt_a1
        }
        vscode.window.showInformationMessage(`Format Document is Beta v0.4, ${Date.now() - timeStart}ms`);

        WARN_fmtDoc_WARN = WARN_fmtDoc_WARN.replace(/\n{2,}/g, '\n\n')
            .replace(/\n*$/, '\n');// doc finish just need one \n
        return [
            new vscode.TextEdit(fullDocumentRange(document), WARN_fmtDoc_WARN),
        ];
    }
}
/*

```ahk
TEST OK
for k,v in Monitors
    if (v.Num = MonitorNum)
        return v

TEST NOT good
TODO fmt_a1
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
