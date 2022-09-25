import type { TAhkFileData } from '../core/ProjectManager';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import {
    arrSum,
    avgMin5,
    stdDevFn,
    stdMin5,
} from './tools/myMath';
import type { TPickReturn } from './tools/pressureTestConfig';
import { pressureTestConfig } from './tools/pressureTestConfig';
import { UpdateCacheAsync } from './UpdateCache';

const DevModeData: number[] = [];

function devTestDA(): void {
    const t1: number = Date.now();

    void UpdateCacheAsync(true)
        .then((ed: TAhkFileData[] | null): null => {
            if (ed !== null) DevModeData.push(Date.now() - t1);
            return null;
        })
        .catch((error: Error): void => {
            console.error('🚀 ~ devTestDA ~ error.message', error);
        });
}

function devTestEnd(iMax: number): void {
    const statistics: number[] = [...DevModeData];
    DevModeData.length = 0;

    const len: number = statistics.length;
    const sum: number = arrSum(statistics);
    const avg: number = sum / len;
    const stdDev: number = stdDevFn(statistics);
    const { subAvg, subAvgArr } = avgMin5(statistics);
    const { subStd, subStdArr } = stdMin5(statistics);

    OutputChannel.appendLine([
        '---------------------------------------------',
        'The task be completed, please confirm!',
        `iMax is ${iMax}`,
        `statistics len is ${len}`,
        `sum is ${sum}`,
        `avg is ${avg}`,
        `stdDev is ${stdDev}`,
        `[${statistics.join(', ')}]`,
        '---Min avg of 5 ---',
        `subAvg is ${subAvg}`, // sample standard avg
        `subAvgArr len is [${subAvgArr.join(', ')}]`,
        '---Min std of 5 ---',
        `subStd is ${subStd}`, // sample standard deviation
        `subStdArr len is [${subStdArr.join(', ')}]`,
        '---------------------------------------------',
    ].join('\n'));

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
    OutputChannel.appendLine(`    please wait of [${label}]`);
    OutputChannel.show();

    for (let i = 1; i <= maxTime; i++) {
        TimeoutList.push(setTimeout(devTestDA, i * delay));
    }

    // eslint-disable-next-line no-magic-numbers
    TimeoutList.push(setTimeout(devTestEnd, (maxTime + 5) * delay, maxTime));
    return null;
}

// ---------------------------------------------
// The task be completed, please confirm!
// iMax is 80
// statistics len is 80
// sum is 13154
// avg is 164.425
// stdDev is 5.2211231150278845
// []
// ---Min avg of 5 ---
// subAvg is 166.8
// subAvgArr len is [168, 166, 167, 166, 167]
// ---Min std of 5 ---
// subStd is 0
// subStdArr len is [168, 168, 168, 168, 168]
// ---------------------------------------------
