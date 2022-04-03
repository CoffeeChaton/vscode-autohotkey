import { TAhkFileData } from '../core/Detecter';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { getFnMetaList } from '../tools/DeepAnalysis/getFnMetaList';
import { arrSum, stdDevFn } from './tools/myMath';
import { EPressureTestMode, pressureTestConfig, TPickReturn } from './tools/pressureTestConfig';
import { TUpdateCacheAsyncReturn, UpdateCacheAsync } from './UpdateCache';

const Data: number[] = [];

async function devTestBase(): Promise<null> {
    const ed: TUpdateCacheAsyncReturn | null = await UpdateCacheAsync();
    if (ed === null) return null;

    Data.push(ed.timeSpend);
    return null;
}

async function devTestDA(): Promise<null> {
    const ed: TUpdateCacheAsyncReturn | null = await UpdateCacheAsync();
    if (ed === null) return null;
    const { timeSpend, FileListData } = ed;

    // DA---
    const t1: number = Date.now();
    FileListData.forEach(({ AhkSymbolList, DocStrMap }: TAhkFileData): void => {
        getFnMetaList(AhkSymbolList, DocStrMap);
    });
    const t2: number = Date.now();
    // DA---

    // The task be completed, please confirm!
    // iMax is 20
    // statistics len is 20
    // sum is 5750
    // avg is 287.5
    // stdDev is 63.51102266536101
    // [432, 396, 378, 356, 263, 249, 246, 246, 245, 244, 245, 365, 255, 245, 242, 246, 243, 245, 245, 364]
    Data.push(t2 - t1 + timeSpend);
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
        mode,
    } = pick;

    OutputChannel.appendLine('---------------------------------------------');
    OutputChannel.appendLine('>> this is Dev tools, open "vscode-js-profile-flame" to get ".cpuprofile"');
    OutputChannel.appendLine(`   please wait of [${label}]`);
    OutputChannel.show();

    const fn: () => Promise<null> = mode === EPressureTestMode.baseAndDA
        ? devTestDA
        : devTestBase;

    for (let i = 1; i <= maxTime; i++) {
        c1.push(setTimeout(fn, i * delay));
    }

    // eslint-disable-next-line no-magic-numbers
    c1.push(setTimeout(devTestEnd, (maxTime + 5) * delay, maxTime));
    return null;
}
