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
    // sum is 3437
    // avg is 171.85
    // stdDev is 14.199559852333453
    // [227, 188, 173, 169, 167, 171, 166, 165, 164, 166, 182, 164, 163, 165, 166, 168, 166, 178, 165, 164]
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

    const pick: TPickReturn | null = await pressureTestConfig();
    if (pick === null) return null;

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
