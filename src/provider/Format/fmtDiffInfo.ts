import * as path from 'node:path';
import { EVersion } from '../../Enum/EVersion';
import type { EFormatChannel } from '../../globalEnum';
import { OutputFormatChannel } from '../vscWindows/OutputChannel';
import type { TDiffMap } from './TFormat';

type TDiffParm = {
    DiffMap: TDiffMap,
    fsPath: string,
    timeStart: number,
    from: EFormatChannel,
};

export function fmtDiffInfo(
    {
        DiffMap,
        fsPath,
        timeStart,
        from,
    }: TDiffParm,
): void {
    if (DiffMap.size === 0) return;

    const msg = [
        '-----------Format Diff Start--------------------------------',
        `${from} ${EVersion.formatRange} "${path.basename(fsPath)}", ${Date.now() - timeStart} ms`,
    ];

    for (const [line, [oldStr, newStr]] of DiffMap) {
        msg.push(
            `line : ${line}`,
            oldStr,
            newStr,
        );
    }

    msg.push('-----------Format Diff End----------------------------------');

    OutputFormatChannel.appendLine(msg.join('\n'));
    // do not callDiff(diffVar);
    // using setTimeout call.
}
