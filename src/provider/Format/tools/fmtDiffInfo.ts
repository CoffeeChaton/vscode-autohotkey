import * as path from 'node:path';
import { EVersion } from '../../../Enum/EVersion';
import type { EFormatChannel } from '../../../globalEnum';
import { fmtLog } from '../../vscWindows/log';

type TStrChange = [string, string];
export type TDiffMap = Map<number, TStrChange>;

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
    const msg: string[] = [
        '\n',
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

    fmtLog.info(msg.join('\n'));
    // do not callDiff(diffVar);
    // using setTimeout call.
}
