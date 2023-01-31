/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,-999] }] */
/* eslint-disable max-lines-per-function */
import type * as vscode from 'vscode';
import { getFormatConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { EFormatChannel } from '../../globalEnum';
import type { TBrackets } from '../../tools/Bracket';
import type { TOccObj } from './oldTools/getDeepKeywords';
import { getDeepKeywords } from './oldTools/getDeepKeywords';
import { getSwitchRange, inSwitchBlock } from './oldTools/SwitchCase';
import { calcAllFileBrackets } from './tools/calcAllFileBrackets';
import type { TDiffMap } from './tools/fmtDiffInfo';
import { fmtDiffInfo } from './tools/fmtDiffInfo';
import { getMatrixMultLine } from './tools/getMatrixMultLine';
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
        AMasterSwitchUseFormatProvider,
    } = getFormatConfig();
    if (!AMasterSwitchUseFormatProvider) return [];

    const { DocStrMap, uri } = AhkFileData;
    const topLabelIndentList: readonly (0 | 1)[] = topLabelIndent(AhkFileData, useTopLabelIndent);
    const allFileBrackets: readonly TBrackets[] = calcAllFileBrackets(DocStrMap);
    const matrixMultLine: readonly (-999 | 0 | 1)[] = getMatrixMultLine(DocStrMap);

    let oldOccObj: TOccObj = {
        lockDeepList: [],
        occ: 0,
        status: '',
    };
    const memo: (Readonly<TOccObj>)[] = [];
    memo.push({ ...oldOccObj });
    const switchRangeArray: vscode.Range[] = [];
    const newTextList: vscode.TextEdit[] = [];

    const DiffMap: TDiffMap = new Map();
    for (const AhkTokenLine of DocStrMap) {
        const { line, lStr } = AhkTokenLine;
        const lStrTrim: string = lStr.trim();

        if (line >= fmtStart && line <= fmtEnd) {
            const brackets: TBrackets = allFileBrackets[line];

            let bracketsDeep: number = brackets[0];
            if (useSquareBracketsIndent) bracketsDeep += brackets[1];
            if (useParenthesesIndent) bracketsDeep += brackets[2];

            newTextList.push(fn_Warn_thisLineText_WARN({
                DiffMap,
                lStrTrim,
                occ: oldOccObj.occ,
                bracketsDeep,
                options,
                switchDeep: inSwitchBlock(lStrTrim, line, switchRangeArray),
                topLabelDeep: topLabelIndentList[line],
                MultLine: matrixMultLine[line],
                formatTextReplace,
            }, AhkTokenLine));
        } else if (line > fmtEnd) {
            break;
        }

        const switchRange: vscode.Range | null = getSwitchRange(DocStrMap, lStrTrim, line);
        if (switchRange !== null) switchRangeArray.push(switchRange);

        oldOccObj = getDeepKeywords({
            lStrTrim,
            oldOccObj,
            AhkTokenLine,
            allFileBrackets,
        });
        memo.push({ ...oldOccObj });
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

    console.log({ ms: Date.now() - timeStart, matrixMultLine, DocStrMap });
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
