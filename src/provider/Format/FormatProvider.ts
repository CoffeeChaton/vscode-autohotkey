/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,100] }] */
import * as vscode from 'vscode';
import { inLTrimRange } from '../../tools/inLTrimRange';
import { getSwitchRange, inSwitchBlock } from './SwitchCase';
import { thisLineDeep } from './thisLineDeep';
import { getDeepKeywords } from './getDeepKeywords';
import { getDeepLTrim } from './getDeepLTrim';
import { isHotStr, isLabel } from './isLabelOrHotStr';
import { getFormatConfig } from '../../configUI';
import { lineReplace } from '../FormatRange/RangeFormatProvider';
import { Pretreatment } from '../../tools/Pretreatment';
import {
    VERSION, DeepReadonly, TTokenStream, DetailType,
} from '../../globalEnum';
import { callDiff, DiffType } from '../../tools/Diff';

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
    DocStrMap: TTokenStream;
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

// eslint-disable-next-line camelcase
function fn_Warn_thisLineText_WARN({
    DocStrMap, textFix, line, occ, deep, labDeep, inLTrim, textRaw, switchRangeArray, document, options,
}: WarnUseType): vscode.TextEdit {
    const wrap = (text: string): vscode.TextEdit => {
        const CommentBlock = DocStrMap[line].detail.includes(DetailType.inComment);
        const newText = getFormatConfig() ? lineReplace(text, textFix, CommentBlock, inLTrim) : text;
        const endCharacter = Math.max(newText.length, textRaw.length);
        const range = new vscode.Range(line, 0, line, endCharacter);
        return new vscode.TextEdit(range, newText);
    };
    if (inLTrim === 1
        && !(/^\s\(/i).test(textRaw)) {
        return wrap(document.lineAt(line).text);
    }

    const WarnLineBodyWarn = document.lineAt(line).text.trimStart();
    if (WarnLineBodyWarn === '') {
        return wrap(WarnLineBodyWarn);
    }

    const switchDeep = inSwitchBlock(textFix, line, switchRangeArray);
    const LineDeep: 0 | 1 = (occ !== 0)
        ? 0
        : thisLineDeep(textFix);
    const curlyBracketsChange: 0 | -1 = textFix.startsWith('}') || (occ > 0 && textFix.startsWith('{'))
        ? -1
        : 0;
    const deepFix = Math.max(0, deep + labDeep + occ + curlyBracketsChange + LineDeep + switchDeep + getDeepLTrim(inLTrim, textRaw));
    const TabSpaces = options.insertSpaces
        ? ' '
        : '\t';
    const TabSize = options.insertSpaces
        ? options.tabSize
        : 1;
    const DeepStr = TabSpaces.repeat(deepFix * TabSize);
    return wrap(`${DeepStr}${WarnLineBodyWarn}`);
}

export function FormatCore(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken,
    diff: boolean,
): vscode.ProviderResult<vscode.TextEdit[]> {
    const timeStart = Date.now();
    const AllDoc = document.getText();
    const DocStrMap = Pretreatment(AllDoc.split('\n'), 0);
    let deep = 0;
    let tagDeep = 0;
    let labDeep: 0 | 1 = 0;
    let occ = 0;

    let inLTrim: 0 | 1 | 2 = 0; // ( LTrim
    const switchRangeArray: vscode.Range[] = [];
    const newTextList: vscode.TextEdit[] = [];
    const lineMax = document.lineCount;
    for (let line = 0; line < lineMax; line++) {
        const { textRaw } = DocStrMap[line];
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

        newTextList.push(fn_Warn_thisLineText_WARN({
            DocStrMap, textFix, line, occ, deep, labDeep, inLTrim, textRaw, switchRangeArray, document, options,
        }));

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
    if (diff) {
        const diffVar: DiffType = {
            leftText: AllDoc,
            right: document.uri,
            fsPath: document.uri.fsPath,
        };
        setTimeout(callDiff, 100, diffVar);
    }

    return newTextList;
}

export class FormatProvider implements vscode.DocumentFormattingEditProvider {
    public provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        return FormatCore(document, options, token, true);
    }
}
/*

```ahk
TEST OK
for k,v in Monitors
    if (v.Num = MonitorNum)
        return v

TEST NOT good
if (ggc()
    && bbc()
    && dd()
    || fff() and feg()) {

}

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
