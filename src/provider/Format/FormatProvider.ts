/* eslint-disable max-lines-per-function */
import type * as vscode from 'vscode';
import { getFormatConfig } from '../../configUI';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { EFormatChannel } from '../../globalEnum';
import { fmtDiffInfo } from './fmtDiffInfo';
import { getDeepKeywords } from './getDeepKeywords';
import { getSwitchRange } from './SwitchCase';
import type { TDiffMap } from './TFormat';
import { topLabelIndent } from './topLabelIndent';
import { fn_Warn_thisLineText_WARN } from './TWarnUse';

type TFmtCoreArgs = {
    /**
     * always update status
     */
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
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

    const { formatTextReplace, useTopLabelIndent } = getFormatConfig();
    const topLabelIndentList: readonly (0 | 1)[] = topLabelIndent(AhkFileData, useTopLabelIndent);
    const { DocStrMap, uri } = AhkFileData;

    let oldDeep = 0;
    let occ = 0;

    const switchRangeArray: vscode.Range[] = [];
    const newTextList: vscode.TextEdit[] = [];

    const DiffMap: TDiffMap = new Map();
    for (const AhkTokenLine of DocStrMap) {
        const { line, lStr } = AhkTokenLine;
        const lStrTrim: string = lStr.trim();

        if (line >= fmtStart && line <= fmtEnd) {
            newTextList.push(fn_Warn_thisLineText_WARN({
                DiffMap,
                lStrTrim,
                occ,
                oldDeep,
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

        oldDeep = DocStrMap[line].deep;

        occ = (lStrTrim.endsWith('{') && !lStrTrim.startsWith('{'))
            ? occ
            : getDeepKeywords(lStrTrim, occ);
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
