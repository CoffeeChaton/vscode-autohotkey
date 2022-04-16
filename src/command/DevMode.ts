import { TAhkFileData } from '../core/Detecter';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { arrSum, stdDevFn } from './tools/myMath';
import { pressureTestConfig, TPickReturn } from './tools/pressureTestConfig';
import { UpdateCacheAsync } from './UpdateCache';

const Data: number[] = [];

async function devTestDA(): Promise<null> {
    const t1: number = Date.now();
    const ed: TAhkFileData[] | null = await UpdateCacheAsync(true);
    if (ed === null) return null;
    const t2: number = Date.now();
    // ---------------------------------------------
    // The task be completed, please confirm!
    // iMax is 20
    // statistics len is 20
    // sum is 3739
    // avg is 186.95
    // stdDev is 9.39401405151174
    // [222, 191, 187, 185, 182, 184, 184, 184, 183, 201, 185, 183, 182, 183, 181, 183, 194, 184, 181, 180]
    // ---------------------------------------------
    Data.push(t2 - t1);
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
