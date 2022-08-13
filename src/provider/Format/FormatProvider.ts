/* eslint-disable max-lines-per-function */
import type * as vscode from 'vscode';
import { pm } from '../../core/ProjectManager';
import { EFormatChannel } from '../../globalEnum';
import { fmtDiffInfo } from './fmtDiffInfo';
import { getDeepKeywords } from './getDeepKeywords';
import { getSwitchRange } from './SwitchCase';
import type { TDiffMap } from './TFormat';
import { fn_Warn_thisLineText_WARN } from './TWarnUse';

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

    const { DocStrMap } = pm.updateDocDef(document);

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
            deep,
        } of DocStrMap
    ) {
        const textFix = lStr.trim();

        if (line >= fmtStart && line <= fmtEnd) {
            newTextList.push(fn_Warn_thisLineText_WARN({
                detail,
                textFix,
                line,
                occ,
                deep,
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
