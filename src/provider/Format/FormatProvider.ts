/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,100] }] */
import * as path from 'path';
import * as vscode from 'vscode';
import { getFormatConfig } from '../../configUI';
import {
    DeepReadonly,
    DetailType,
    EStr,
    TFormatChannel,
    TTokenStream,
} from '../../globalEnum';
import { callDiff, DiffType } from '../../tools/Diff';
import { Pretreatment } from '../../tools/Pretreatment';
import { inLTrimRange } from '../../tools/str/inLTrimRange';
import { lineReplace } from './fmtReplace';
import { fmtReplaceWarn } from './fmtReplaceWarn';
import { getDeepKeywords } from './getDeepKeywords';
import { getDeepLTrim } from './getDeepLTrim';
import { isHotStr, isLabel } from './isLabelOrHotStr';
import { getSwitchRange, inSwitchBlock } from './SwitchCase';
import { thisLineDeep } from './thisLineDeep';

function Hashtag(textFix: string): '#if' | '#HotString' | '' {
    if (textFix === '') return '';

    // https://www.autohotkey.com/docs/commands/_If.htm#Basic_Operation
    if (
        (/^#ifWin(?:not)?(?:active|exist)\b/ui).test(textFix)
        || (/^#if\b/ui).test(textFix)
    ) {
        return '#if';
    }

    // https://www.autohotkey.com/docs/commands/_Hotstring.htm
    if ((/^#hotstring\b/ui).test(textFix)) return '#HotString';

    return '';
}

function isReturn(tagDeep: number, deep: number, textFix: string): boolean {
    return (tagDeep === deep && (/^\s*return\s*$/iu).test(textFix));
}

type WarnUseType =
    & DeepReadonly<{
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
    }>
    & {
        hasDiff: [boolean];
    };

function wrap(args: WarnUseType, text: string): vscode.TextEdit {
    const {
        DocStrMap,
        textFix,
        line,
        inLTrim,
        textRaw,
        hasDiff,
    } = args;
    const { detail } = DocStrMap[line];

    const CommentBlock: boolean = detail.includes(DetailType.inComment);
    const newText: string = getFormatConfig()
        ? lineReplace(text, textFix, CommentBlock, inLTrim)
        : text;

    if (newText !== text) {
        hasDiff[0] = true;
    }

    const endCharacter: number = Math.max(newText.length, textRaw.length);
    const range = new vscode.Range(line, 0, line, endCharacter);
    return new vscode.TextEdit(range, newText); // FIXME some time, we don't need new TextEdit. but callDiff need this...
}

// eslint-disable-next-line @typescript-eslint/naming-convention
function fn_Warn_thisLineText_WARN(args: WarnUseType): vscode.TextEdit {
    const {
        textFix,
        line,
        occ,
        deep,
        labDeep,
        inLTrim,
        textRaw,
        switchRangeArray,
        document,
        options, // by self
    } = args;

    if (
        inLTrim === 1
        && !(/^\s\(/iu).test(textRaw)
    ) {
        return wrap(args, document.lineAt(line).text);
        //    return wrap(args, textRaw.replace(/\r$/u, ''));
    }

    // const WarnLineBodyWarn: string = textRaw.replace(/\r$/u, '').trimStart();
    const WarnLineBodyWarn = document.lineAt(line).text.trimStart();
    if (WarnLineBodyWarn === '') {
        return wrap(args, WarnLineBodyWarn);
    }

    const switchDeep = inSwitchBlock(textFix, line, switchRangeArray);
    const LineDeep: 0 | 1 = (occ !== 0)
        ? 0
        : thisLineDeep(textFix);

    const curlyBracketsChange: 0 | -1 = textFix.startsWith('}') || (occ > 0 && textFix.startsWith('{'))
        ? -1
        : 0;

    const deepFix = Math.max(
        0,
        deep + labDeep + occ + curlyBracketsChange + LineDeep + switchDeep + getDeepLTrim(inLTrim, textRaw),
    );

    const TabSpaces = options.insertSpaces
        ? ' '
        : '\t';

    const TabSize = options.insertSpaces
        ? options.tabSize
        : 1;

    const DeepStr = TabSpaces.repeat(deepFix * TabSize);
    return wrap(args, `${DeepStr}${WarnLineBodyWarn}`);
}

type TFmtCoreArgs = {
    document: vscode.TextDocument;
    options: vscode.FormattingOptions;
    fmtStart: number;
    fmtEnd: number;
    from: TFormatChannel;
    needDiff: boolean;
};

export function FormatCore(
    {
        document,
        options,
        fmtStart,
        fmtEnd,
        from,
        needDiff,
    }: TFmtCoreArgs,
): vscode.ProviderResult<vscode.TextEdit[]> {
    if (path.basename(document.uri.fsPath, '.ahk').startsWith(EStr.diff_name_prefix)) {
        const message = 'Don\'t Format the TEMP file!';
        void vscode.window.showWarningMessage(message);
        return [];
    }
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
    const hasDiff: [boolean] = [false];
    for (let line = 0; line < lineMax; line++) {
        const { textRaw } = DocStrMap[line];
        inLTrim = inLTrimRange(textRaw, inLTrim);
        const textFix = DocStrMap[line].lStr.trim();
        const hasHashtag = Hashtag(textFix);
        const HotStr = isHotStr(textFix);
        const Label = isLabel(textFix);
        if (
            isReturn(tagDeep, deep, textFix)
            // Return
            || hasHashtag
            // #if #hotstring
            || (tagDeep > 0 && tagDeep === deep && (HotStr || Label)) // `::btw::\n` //  `label:`
        ) {
            labDeep = 0;
        }

        if (line >= fmtStart && line <= fmtEnd) {
            newTextList.push(fn_Warn_thisLineText_WARN({
                DocStrMap,
                textFix,
                line,
                occ,
                deep,
                labDeep,
                inLTrim,
                textRaw,
                switchRangeArray,
                document,
                options,
                hasDiff,
            }));
        } else if (line > fmtEnd) {
            break;
        }

        const switchRange: vscode.Range | null = getSwitchRange(document, DocStrMap, textFix, line, lineMax);
        if (switchRange !== null) switchRangeArray.push(switchRange);

        if (hasHashtag !== '') { // #IF  #hotstring
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

    // TODO return have Diff
    if (needDiff && hasDiff[0]) {
        const fileName = path.basename(document.uri.fsPath);
        fmtReplaceWarn(timeStart, from, fileName);

        const rTextList: string[] = [];
        newTextList.forEach((v: vscode.TextEdit) => rTextList.push(v.newText));

        const rightText: string = rTextList.join('\n');
        const diffVar: DiffType = {
            leftText: AllDoc,
            rightText,
            fileName,
        };
        setTimeout(callDiff, 100, diffVar);
        // do not callDiff(diffVar);
        // using setTimeout call.
    }

    return newTextList;
}

export class FormatProvider implements vscode.DocumentFormattingEditProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        return FormatCore({
            document,
            options,
            fmtStart: 0,
            fmtEnd: document.lineCount - 1,
            from: TFormatChannel.byFormatAllFile,
            needDiff: true,
        });
    }
}
/*
-----------------------------------------------
TEST OK

for k,v in Monitors
    if (v.Num = MonitorNum)
        return v
-----------------------------------------------
TEST NOT well

if (ggc()
    && bbc()
    && dd()
    || fff() and feg()) {

}
-----------------------------------------------
TEST NOT well

for k,v in Monitors
    for k,v in Monitors
        for k,v in Monitors
            if gg(){
                d:=g
                for k,v in Monitors
                    for k,v in Monitors
                        if dd()
                            bbb :=ddd()
            }
----------------------------------------------
*/
