import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { arrSum, stdDevFn } from './tools/myMath';
import { pressureTestConfig, TPickReturn } from './tools/pressureTestConfig';
import { TUpdateCacheAsyncReturn, UpdateCacheAsync } from './UpdateCache';

const Data: number[] = [];

async function devTestDA(): Promise<null> {
    const ed: TUpdateCacheAsyncReturn | null = await UpdateCacheAsync();
    if (ed === null) return null;
    // ---------------------------------------------
    // The task be completed, please confirm!
    // iMax is 20
    // statistics len is 20
    // sum is 3851
    // avg is 192.55
    // stdDev is 13.097614286579065
    // [245, 203, 184, 193, 195, 183, 193, 187, 191, 194, 191, 186, 188, 187, 197, 185, 184, 193, 190, 182]
    // ---------------------------------------------
    Data.push(ed.timeSpend);
    return null;
}

function devTestEnd(iMax: number): void {
    const statistics = [...Data];
    Data.length = 0;

    const len = statistics.length;
    const sum: number = arrSum(statistics);
    const avg: number = sum / len;
    const stdDev: number = stdDevFn(statistics);

    OutputChannel.appendLine('---------------------------------------------');
    OutputChannel.appendLine('The task be completed, please confirm!');
    OutputChannel.appendLine(`iMax is ${iMax}`);
    OutputChannel.appendLine(`statistics len is ${len}`);
    OutputChannel.appendLine(`sum is ${sum}`);
    OutputChannel.appendLine(`avg is ${avg}`);
    OutputChannel.appendLine(`stdDev is ${stdDev}`);
    OutputChannel.appendLine(`[${statistics.join(', ')}]`);
    OutputChannel.appendLine('---------------------------------------------');
    OutputChannel.show();
}

const c1: NodeJS.Timeout[] = [];

export async function pressureTest(): Promise<null> {
    c1.forEach((timeout: NodeJS.Timeout): void => clearInterval(timeout));
    c1.length = 0;
    Data.length = 0;

    const pick: TPickReturn | undefined = await pressureTestConfig();
    if (pick === undefined) return null;

    const {
        maxTime,
        delay,
        label,
    } = pick;

    OutputChannel.appendLine('---------------------------------------------');
    OutputChannel.appendLine('>> this is Dev tools, open "vscode-js-profile-flame" to get ".cpuprofile"');
    OutputChannel.appendLine(`   please wait of [${label}]`);
    OutputChannel.show();

    // const fn: () => Promise<null> = mode === EPressureTestMode.baseAndDA
    //     ? devTestDA
    //     : devTestBase;

    for (let i = 1; i <= maxTime; i++) {
        c1.push(setTimeout(devTestDA, i * delay));
    }

    // eslint-disable-next-line no-magic-numbers
    c1.push(setTimeout(devTestEnd, (maxTime + 5) * delay, maxTime));
    return null;
}
