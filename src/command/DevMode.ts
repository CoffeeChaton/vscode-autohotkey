import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { DeepAnalysis } from '../tools/DeepAnalysis/DeepAnalysis';
import { arrSum, stdDevFn } from './tools/myMath';
import { EPressureTestMode, pressureTestConfig, TPickReturn } from './tools/pressureTestConfig';
import { UpdateCacheAsync } from './UpdateCache';

const Data: number[] = [];

async function devTestBase(): Promise<null> {
    const ed = await UpdateCacheAsync(false);
    if (ed === null) return null;

    Data.push(ed.timeSpend);
    return null;
}

async function devTestDA(): Promise<null> {
    const ed = await UpdateCacheAsync(false);
    if (ed === null) return null;
    const { timeSpend, DocFullData } = ed;

    // DA---
    const t1 = Date.now();
    for (const { nekoData, vscDoc } of DocFullData) {
        const { AhkSymbolList } = nekoData;
        for (const ahkSymbol of AhkSymbolList) {
            DeepAnalysis(vscDoc, ahkSymbol);
        }
    }
    const t2 = Date.now();
    // DA---

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
    OutputChannel.appendLine('>> this is Dev tools ,open *vscode-js-profile-flame* to get .cpuprofile');
    OutputChannel.appendLine(`   please wait of [${label}]`);
    OutputChannel.show();

    for (let i = 1; i <= maxTime; i++) {
        if (mode === EPressureTestMode.justBase) {
            c1.push(setTimeout(devTestBase, i * delay));
        }
        if (mode === EPressureTestMode.baseAndDA) {
            c1.push(setTimeout(devTestDA, i * delay));
        }
    }

    // eslint-disable-next-line no-magic-numbers
    c1.push(setTimeout(devTestEnd, (maxTime + 5) * delay, maxTime));
    return null;
}
