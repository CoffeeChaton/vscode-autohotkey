import * as path from 'path';
import * as vscode from 'vscode';
import { EFormatChannel } from '../../globalEnum';
import { callDiff, TDiff } from '../../tools/Diff';
import { OutputChannel } from '../vscWindows/OutputChannel';
import { fmtReplaceWarn } from './fmtReplaceWarn';
import { TDiffMap } from './TFormat';

// TODO return have Diff
// eslint-disable-next-line max-params
export function fmtDiffInfo(
    DiffMap: TDiffMap,
    document: vscode.TextDocument,
    timeStart: number,
    from: EFormatChannel,
    newTextList: vscode.TextEdit[],
): void {
    if (DiffMap.size === 0) return;

    const fileName: string = path.basename(document.uri.fsPath);
    fmtReplaceWarn(timeStart, from, fileName);

    const rTextList: string[] = [];
    newTextList.forEach((v: vscode.TextEdit) => rTextList.push(v.newText));

    const rightText: string = rTextList.join('\n');
    const AllDoc: string = document.getText();
    const diffVar: TDiff = {
        leftText: AllDoc,
        rightText,
        fileName,
    };
    // eslint-disable-next-line no-magic-numbers
    setTimeout(callDiff, 100, diffVar);
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
