import * as path from 'node:path';
import type * as vscode from 'vscode';
import type { EFormatChannel } from '../../globalEnum';
import { OutputChannel } from '../vscWindows/OutputChannel';
import { fmtReplaceWarn } from './fmtReplaceWarn';
import type { TDiffMap } from './TFormat';

type TDiffParm = {
    DiffMap: TDiffMap;
    document: vscode.TextDocument;
    timeStart: number;
    from: EFormatChannel;
};

export function fmtDiffInfo(
    {
        DiffMap,
        document,
        timeStart,
        from,
    }: TDiffParm,
): void {
    if (DiffMap.size === 0) return;

    const fileName: string = path.basename(document.uri.fsPath);
    fmtReplaceWarn(timeStart, from, fileName);

    OutputChannel.appendLine('-----------Format Diff Start--------------------------------');
    for (const [ln, [oldStr, newStr]] of DiffMap) {
        OutputChannel.appendLine(`line : ${ln}`);
        OutputChannel.appendLine(oldStr);
        OutputChannel.appendLine(newStr);
    }
    OutputChannel.appendLine('-----------Format Diff End----------------------------------');
    OutputChannel.show();
    // do not callDiff(diffVar);
    // using setTimeout call.
}
