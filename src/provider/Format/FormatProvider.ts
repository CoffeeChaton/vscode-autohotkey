/* eslint-disable max-lines-per-function */
import type * as vscode from 'vscode';
import { getFormatConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { EFormatChannel } from '../../globalEnum';
import type { TBrackets } from '../../tools/Bracket';
import { getDeepKeywords } from './oldTools/getDeepKeywords';
import { getSwitchRange } from './oldTools/SwitchCase';
import { calcAllFileBrackets } from './tools/calcAllFileBrackets';
import type { TDiffMap } from './tools/fmtDiffInfo';
import { fmtDiffInfo } from './tools/fmtDiffInfo';
import { topLabelIndent } from './tools/topLabelIndent';
import { fn_Warn_thisLineText_WARN } from './TWarnUse';

type TFmtCoreArgs = {
    /**
     * always update status
     */
    document: vscode.TextDocument,
    options: vscode.FormattingOptions, // TODO add more config
    fmtStart: number,
    fmtEnd: number,
    from: EFormatChannel,
    needDiff: boolean,
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

    /**
     * always update status
     */
    const AhkFileData: TAhkFileData | null = pm.updateDocDef(document);
    if (AhkFileData === null) return [];

    const {
        formatTextReplace,
        useTopLabelIndent,
        useParenthesesIndent,
        useSquareBracketsIndent,
    } = getFormatConfig();

    const { DocStrMap, uri } = AhkFileData;
    const topLabelIndentList: readonly (0 | 1)[] = topLabelIndent(AhkFileData, useTopLabelIndent);
    const allFileBrackets: readonly TBrackets[] = calcAllFileBrackets(DocStrMap);

    let occ = 0;

    const switchRangeArray: vscode.Range[] = [];
    const newTextList: vscode.TextEdit[] = [];

    const DiffMap: TDiffMap = new Map();
    for (const AhkTokenLine of DocStrMap) {
        const { line, lStr, cll } = AhkTokenLine;
        const lStrTrim: string = lStr.trim();

        if (line >= fmtStart && line <= fmtEnd) {
            const brackets: TBrackets = allFileBrackets[line];

            let bracketsDeep: number = brackets[0];
            if (useSquareBracketsIndent) bracketsDeep += brackets[1];
            if (useParenthesesIndent) bracketsDeep += brackets[2];

            newTextList.push(fn_Warn_thisLineText_WARN({
                DiffMap,
                lStrTrim,
                occ,
                bracketsDeep,
                options,
                switchRangeArray,
                topLabelDeep: topLabelIndentList[line],
                formatTextReplace,
            }, AhkTokenLine));
        } else if (line > fmtEnd) {
            break;
        }

        const switchRange: vscode.Range | null = getSwitchRange(DocStrMap, lStrTrim, line);
        if (switchRange !== null) switchRangeArray.push(switchRange);

        occ = lStrTrim.endsWith('{') && !lStrTrim.startsWith('{')
            ? occ
            : getDeepKeywords(lStrTrim, occ, cll);
    }

    if (DiffMap.size > 0) {
        const { fsPath } = uri;
        fmtDiffInfo({
            DiffMap,
            fsPath,
            timeStart,
            from,
        });
    }

    //  console.log({ ms: Date.now() - timeStart, allFileBrackets, topLabelIndentList });

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
