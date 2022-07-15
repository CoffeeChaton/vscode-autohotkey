import type { TAhkFileData } from '../core/Detecter';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { arrSum, stdDevFn } from './tools/myMath';
import type { TPickReturn } from './tools/pressureTestConfig';
import { pressureTestConfig } from './tools/pressureTestConfig';
import { UpdateCacheAsync } from './UpdateCache';

const DevModeData: number[] = [];

async function devTestDA(): Promise<null> {
    const t1: number = Date.now();
    const ed: TAhkFileData[] | null = await UpdateCacheAsync(true);
    if (ed === null) return null;
    const t2: number = Date.now();
    // ---------------------------------------------
    // The task be completed, please confirm!
    // iMax is 80
    // statistics len is 80
    // sum is 13266
    // avg is 165.825
    // stdDev is 4.65235155593384
    // ---------------------------------------------
    DevModeData.push(t2 - t1);
    return null;
}

function devTestEnd(iMax: number): void {
    const statistics: number[] = [...DevModeData];
    DevModeData.length = 0;

    const len: number = statistics.length;
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

const TimeoutList: NodeJS.Timeout[] = [];

export async function pressureTest(): Promise<null> {
    for (const timeout of TimeoutList) {
        clearInterval(timeout);
    }
    TimeoutList.length = 0;
    DevModeData.length = 0;

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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        TimeoutList.push(setTimeout(devTestDA, i * delay));
    }

    // eslint-disable-next-line no-magic-numbers
    TimeoutList.push(setTimeout(devTestEnd, (maxTime + 5) * delay, maxTime));
    return null;
}
