/* eslint-disable max-lines-per-function */
import type * as vscode from 'vscode';
import { Detecter } from '../../core/Detecter';
import { EFormatChannel } from '../../globalEnum';
import { fmtDiffInfo } from './fmtDiffInfo';
import { getDeepKeywords } from './getDeepKeywords';
import { isHotStr, isLabel } from './isLabelOrHotStr';
import { getSwitchRange } from './SwitchCase';
import type { TDiffMap } from './TFormat';
import { fn_Warn_thisLineText_WARN } from './TWarnUse';

function Hashtag(textFix: string): '' | '#HotString' | '#if' {
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

type TFmtCoreArgs = {
    document: vscode.TextDocument;
    options: vscode.FormattingOptions;
    fmtStart: number;
    fmtEnd: number;
    from: EFormatChannel;
    needDiff: boolean;
};

export function FormatCore(
    {
        document,
        options,
        fmtStart,
        fmtEnd,
        from,
    }: TFmtCoreArgs,
): vscode.TextEdit[] {
    const timeStart: number = Date.now();

    const { DocStrMap } = Detecter.updateDocDef(document);
    let deep = 0;
    let tagDeep = 0;
    let labDeep: 0 | 1 = 0;
    let occ = 0;

    const switchRangeArray: vscode.Range[] = [];
    const newTextList: vscode.TextEdit[] = [];

    const DiffMap: TDiffMap = new Map();
    for (
        const {
            line,
            textRaw,
            lStr,
            detail,
            LTrim,
        } of DocStrMap
    ) {
        const textFix = lStr.trim();
        const hasHashtag = Hashtag(textFix);
        const HotStr = isHotStr(textFix);
        const Label = isLabel(textFix);
        if (
            isReturn(tagDeep, deep, textFix)
            // Return
            || hasHashtag !== ''
            // #if #hotstring
            || (tagDeep > 0 && tagDeep === deep && (HotStr || Label)) // `::btw::\n` //  `label:`
        ) {
            labDeep = 0;
        }

        if (line >= fmtStart && line <= fmtEnd) {
            newTextList.push(fn_Warn_thisLineText_WARN({
                detail,
                textFix,
                line,
                occ,
                deep,
                labDeep,
                LTrim,
                textRaw,
                switchRangeArray,
                document,
                options,
                DiffMap,
            }));
        } else if (line > fmtEnd) {
            break;
        }

        const switchRange: vscode.Range | null = getSwitchRange(document, DocStrMap, textFix, line);
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

    fmtDiffInfo({
        DiffMap,
        document,
        timeStart,
        from,
    });

    return newTextList;
}

export const FormatProvider: vscode.DocumentFormattingEditProvider = {
    provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.TextEdit[]> {
        return FormatCore({
            document,
            options,
            fmtStart: 0,
            fmtEnd: document.lineCount - 1,
            from: EFormatChannel.byFormatAllFile,
            needDiff: true,
        });
    },
};
