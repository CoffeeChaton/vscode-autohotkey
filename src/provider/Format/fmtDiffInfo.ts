import * as path from 'path';
import * as vscode from 'vscode';
import { EFormatChannel } from '../../globalEnum';
import { OutputChannel } from '../vscWindows/OutputChannel';
import { fmtReplaceWarn } from './fmtReplaceWarn';
import { TDiffMap } from './TFormat';

type TDiffParm = {
    DiffMap: TDiffMap;
    document: vscode.TextDocument;
    timeStart: number;
    from: EFormatChannel;
    newTextList: vscode.TextEdit[];
};
// eslint-disable-next-line max-params
export function fmtDiffInfo(
    {
        DiffMap,
        document,
        timeStart,
        from,
        newTextList,
    }: TDiffParm,
): void {
    if (DiffMap.size === 0) return;

    const fileName: string = path.basename(document.uri.fsPath);
    fmtReplaceWarn(timeStart, from, fileName);

    const rTextList: string[] = [];
    newTextList.forEach((v: vscode.TextEdit) => rTextList.push(v.newText));

    // eslint-disable-next-line no-magic-numbers

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
