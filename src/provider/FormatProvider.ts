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

function fullDocumentRange(document: vscode.TextDocument): vscode.Range {
    const endLine = document.lineCount - 1;
    return new vscode.Range(0, 0, endLine, document.lineAt(endLine).text.length);
}

function Hashtag(textFix: string): '#if' | '#HotString' | '' {
    if (textFix === '') return '';

    // https://www.autohotkey.com/docs/commands/_If.htm#Basic_Operation
    if ((/^#ifwin(?:not)?(?:active|exist)\b/).test(textFix)
        || (/^#if\b/).test(textFix)) {
        return '#if';
    }

    // https://www.autohotkey.com/docs/commands/_Hotstring.htm
    if ((/^#hotstring\b/).test(textFix)) return '#HotString';

    return '';
}

function isReturn(tagDeep: number, deep: number, textRaw: string): boolean {
    return (tagDeep === deep && textRaw.trim().toLowerCase() === 'return');
}

function calcDeep(textFix: string): number {
    if (textFix === '') return 0;
    let block = 0;
    // if (textFix.endsWith('{')) block += 1; // {$
    // if (textFix.startsWith('}')) block -= 1; // ^}
    block += ((/\{/).exec(textFix) || []).length;
    block -= ((/\}/).exec(textFix) || []).length;
    return block;
}

// eslint-disable-next-line max-params
function fn_Warn_thisLineText_WARN(textFix: string, line: number, CommentBlock: boolean,
    occ: number, deep: number, inLTrim: 0 | 1 | 2, textRaw: string,
    switchRangeArray: vscode.Range[], document: vscode.TextDocument, options: vscode.FormattingOptions): string {
    if (inLTrim === 1 && textRaw.trim().startsWith('(') === false) {
        return `${document.lineAt(line).text}`;
    }

    const WarnLineBodyWarn = document.lineAt(line).text.trimStart();
    if (WarnLineBodyWarn === '') {
        return WarnLineBodyWarn;
    }

    const switchDeep = inSwitchBlock(textFix, line, switchRangeArray);
    const LineDeep: 0 | 1 = CommentBlock || (occ !== 0)
        ? 0
        : thisLineDeep(textFix);
    const curlyBracketsChange: 0 | -1 = textFix.startsWith('}') || (occ > 0 && textFix.startsWith('{'))
        ? -1
        : 0;
    const deepFix = Math.max(deep + occ + curlyBracketsChange + LineDeep + switchDeep + getDeepLTrim(inLTrim, textRaw), 0);
    const TabSpaces = options.insertSpaces
        ? ' '
        : '\t';
    const TabSize = options.insertSpaces
        ? options.tabSize
        : 1;
    const DeepStr = TabSpaces.repeat(deepFix * TabSize);
    return `${DeepStr}${WarnLineBodyWarn}`;
}
export class FormatProvider implements vscode.DocumentFormattingEditProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const timeStart = Date.now();
        let WarnFmtDocWarn = ''; // WARN TO USE THIS !!
        let deep = 0;
        let tagDeep = 0;
        let occ = 0;
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
            const textRaw = document.lineAt(line).text;
            CommentBlock = inCommentBlock(textRaw, CommentBlock);
            inLTrim = inLTrimRange(textRaw, inLTrim);
            const textFix = (CommentBlock || getSkipSign(textRaw) || inLTrim > 0)
                ? ''
                : removeSpecialChar2(textRaw).trim().toLowerCase();

            const hasHashtag = Hashtag(textFix);
            const hasLabelOrHotStr = isLabelOrHotStr(textFix);
            if (isReturn(tagDeep, deep, textRaw)// Return
                || hasHashtag// #if #hotstring
                || (tagDeep > 0 && tagDeep === deep && hasLabelOrHotStr) // `label:` or `::btw::\n`
            ) {
                deep -= 1;
            }

            if (deep < 0) deep = 0;
            WarnFmtDocWarn += fn_Warn_thisLineText_WARN(textFix, line, CommentBlock, occ,
                deep, inLTrim, textRaw, switchRangeArray, document, options);
            WarnFmtDocWarn += '\n';
            // after

            const switchRange = getSwitchRange(document, textFix, line, lineMax);
            if (switchRange) switchRangeArray.push(switchRange);

            if (hasHashtag) { // #IF  #hotstring
                deep += 1;
            }

            if (hasLabelOrHotStr) { // label:
                deep += 1;
                tagDeep = deep;
            }

            deep += hasDoubleSemicolon(textFix)
                ? 0
                : calcDeep(textFix);

            occ = (textFix.endsWith('{') && !textFix.startsWith('{'))
                ? occ
                : getDeepKeywords(textFix, occ); // TODO fmt_a1
        }
        vscode.window.showInformationMessage(`Format Document is Beta v0.472, ${Date.now() - timeStart}ms`);

        WarnFmtDocWarn = WarnFmtDocWarn.replace(/\n{2,}/g, '\n\n')
            .replace(/\n*$/, '\n');// doc finish just need one \n

        return [
            new vscode.TextEdit(fullDocumentRange(document), WarnFmtDocWarn),
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
