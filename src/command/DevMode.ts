import * as vscode from 'vscode';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { arrSum, stdDevFn } from './tools/myMath';
import { UpdateCacheAsync } from './UpdateCache';

const Data: number[] = [];

async function devTest(): Promise<null> {
    const time = await UpdateCacheAsync(false);
    if (time === null) return null;
    Data.push(time);
    return null;
}

function devTestEnd(iMax: number): void {
    const len = Data.length;
    const sum: number = arrSum(Data);
    const avg: number = sum / len;
    const stdDev: number = stdDevFn(Data);

    OutputChannel.appendLine('---------------------------------------------');
    OutputChannel.appendLine('The task should be completed, please confirm!');
    OutputChannel.appendLine(`iMax is ${iMax}`);
    OutputChannel.appendLine(`Data len is ${len}`);
    OutputChannel.appendLine(`sum is ${sum}`);
    OutputChannel.appendLine(`avg is ${avg}`);
    OutputChannel.appendLine(`stdDev is ${stdDev}`);
    OutputChannel.appendLine(`[${Data.join(', ')}]`);
    OutputChannel.appendLine('---------------------------------------------');
    OutputChannel.show();
}

let c1: NodeJS.Timeout[] = [];
export async function DevLoopOfClearOutlineCache(): Promise<null> {
    void vscode.window.showInformationMessage('this is Dev function ,open profile-flame to get .cpuprofile');

    c1.forEach((e) => clearInterval(e));
    c1 = [];
    Data.length = 0;

    type TPick = {
        label: string;
        maxTime: number;
    };

    const base = 200;
    const min1 = 300; // 60 * 1000 / base
    const sec10 = 50; // 10 * 1000 / base

    const items: TPick[] = [
        { label: '1 min', maxTime: min1 },
        { label: '10 sec', maxTime: sec10 },
    ];

    const pick = await vscode.window.showQuickPick<TPick>(items);
    if (pick === undefined) return null;

    // set end
    const iMax = pick.maxTime;
    for (let i = 1; i <= iMax; i++) {
        c1.push(setTimeout(devTest, i * base));
    }
    // eslint-disable-next-line no-magic-numbers
    c1.push(setTimeout(devTestEnd, (iMax + 10) * base, iMax));
    return null;
}
