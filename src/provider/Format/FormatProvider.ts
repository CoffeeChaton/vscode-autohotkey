/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,100] }] */
import * as vscode from 'vscode';
// import { getLStr } from '../../tools/removeSpecialChar';
import { inLTrimRange } from '../../tools/inLTrimRange';
import { getSwitchRange, inSwitchBlock } from './SwitchCase';
import { thisLineDeep } from './thisLineDeep';
import { getDeepKeywords } from './getDeepKeywords';
import { getDeepLTrim } from './getDeepLTrim';
import { isHotStr, isLabel } from './isLabelOrHotStr';
import { getFormatConfig } from '../../configUI';
import { RangeFormat } from '../FormatRange/RangeFormatProvider';
import { Pretreatment } from '../../tools/Pretreatment';
import { getFullDocumentRange } from '../../tools/getFullDocumentRange';
import { VERSION, DeepReadonly } from '../../globalEnum';

function Hashtag(textFix: string): '#if' | '#HotString' | '' {
    if (textFix === '') return '';

    // https://www.autohotkey.com/docs/commands/_If.htm#Basic_Operation
    if ((/^#ifwin(?:not)?(?:active|exist)\b/i).test(textFix)
        || (/^#if\b/i).test(textFix)) {
        return '#if';
    }

    // https://www.autohotkey.com/docs/commands/_Hotstring.htm
    if ((/^#hotstring\b/i).test(textFix)) return '#HotString';

    return '';
}

function isReturn(tagDeep: number, deep: number, textFix: string): boolean {
    return (tagDeep === deep && (/^\s*return\s*$/i).test(textFix));
}

type WarnUseType = DeepReadonly<{
    textFix: string;
    line: number;
    occ: number;
    deep: number;
    labDeep: 0 | 1;
    inLTrim: 0 | 1 | 2;
    textRaw: string;
    switchRangeArray: vscode.Range[];
    document: vscode.TextDocument;
    options: vscode.FormattingOptions;
}>;

// eslint-disable-next-line max-params
function fn_Warn_thisLineText_WARN({
    textFix, line, occ, deep, labDeep, inLTrim, textRaw, switchRangeArray, document, options,
}: WarnUseType): string {
    if (inLTrim === 1 && textRaw.trim().startsWith('(') === false) {
        return document.lineAt(line).text;
    }

    const WarnLineBodyWarn = document.lineAt(line).text.trimStart();
    if (WarnLineBodyWarn === '') {
        return WarnLineBodyWarn;
    }

    const switchDeep = inSwitchBlock(textFix, line, switchRangeArray);
    const LineDeep: 0 | 1 = (occ !== 0)
        ? 0
        : thisLineDeep(textFix);
    const curlyBracketsChange: 0 | -1 = textFix.startsWith('}') || (occ > 0 && textFix.startsWith('{'))
        ? -1
        : 0;
    const deepFix = Math.max(deep + labDeep + occ + curlyBracketsChange + LineDeep + switchDeep + getDeepLTrim(inLTrim, textRaw), 0);
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
        const AllDoc = document.getText();
        const DocStrMap = Pretreatment(AllDoc.split('\n'));
        let WarnFmtDocWarn = ''; // WARN TO USE THIS !!
        let deep = 0;
        let tagDeep = 0;
        let labDeep: 0 | 1 = 0;
        let occ = 0;
        let inLTrim: 0 | 1 | 2 = 0; // ( LTrim
        const switchRangeArray: vscode.Range[] = [];
        // const parentheses = [{ line: 0, deep: 0 }]; // ()
        // const squareBrackets = [{ line: 0, deep: 0 }]; // []
        // const curlyBrackets = [{ line: 0, deep: 0 }]; // {}
        // const nextLineDeep = [{ line: 0, deep: 0 }]; // if
        // const labeHashtag = [{ line: 0, deep: 0 }]; // ^#if #win
        //   const labels = [{ line: 0, deep: 0 }]; // labe:$
        // const HotStr = [{ line: 0, deep: 0 }]; // ^::HotStr::
        const lineMax = document.lineCount;
        for (let line = 0; line < lineMax; line++) {
            // eslint-disable-next-line prefer-destructuring
            const textRaw = DocStrMap[line].textRaw;
            inLTrim = inLTrimRange(textRaw, inLTrim);
            const textFix = DocStrMap[line].lStr.trim();
            const hasHashtag = Hashtag(textFix);
            const HotStr = isHotStr(textFix);
            const Label = isLabel(textFix);
            if (isReturn(tagDeep, deep, textFix)// Return
                || hasHashtag// #if #hotstring
                || (tagDeep > 0 && tagDeep === deep && (HotStr || Label)) // `::btw::\n` //  `label:`
            ) {
                labDeep = 0;
            }

            WarnFmtDocWarn = `${WarnFmtDocWarn + fn_Warn_thisLineText_WARN({
                textFix, line, occ, deep, labDeep, inLTrim, textRaw, switchRangeArray, document, options,
            })}\n`;

            const switchRange = getSwitchRange(document, DocStrMap, textFix, line, lineMax);
            if (switchRange) switchRangeArray.push(switchRange);

            if (hasHashtag) { // #IF  #hotstring
                labDeep = 1;
            }

            if (HotStr || Label) { // label:
                labDeep = 1;
                tagDeep = deep;
            }

            deep = DocStrMap[line].deep;

            occ = (textFix.endsWith('{') && !textFix.startsWith('{'))
                ? occ
                : getDeepKeywords(textFix, occ); // TODO fmt_a1
        }
        console.log(`Format Document is Beta ${VERSION.format}, ${Date.now() - timeStart}ms`);

        WarnFmtDocWarn = WarnFmtDocWarn
            .replace(/\n{2,}/g, '\n\n')
            .replace(/\n*$/, '\n');// doc finish only need one \n

        const fullRange = getFullDocumentRange(document);

        return getFormatConfig()
            ? RangeFormat({
                timeStart, RangeTextRaw: AllDoc, RangeText: WarnFmtDocWarn, fsPath: document.uri.fsPath, range: fullRange,
            })
            : [new vscode.TextEdit(fullRange, WarnFmtDocWarn)];
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
