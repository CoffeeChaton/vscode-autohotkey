import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import { Detecter } from '../core/Detecter';
import { OutputChannel } from '../provider/vscWindows/OutputChannel';
import { digDAFile } from '../tools/DeepAnalysis/Diag/digDAFile';
import { getDAList } from '../tools/DeepAnalysis/getDAList';
import type { TWordFrequencyStatistics } from './tools/WordFrequencyStatistics';
import { WordFrequencyStatistics } from './tools/WordFrequencyStatistics';

function showOutputChannel(results: TWordFrequencyStatistics, timeSpend: number): void {
    const {
        paramMapSize,
        valMapSize,
        textMapSize,
        topFuncNum,
    } = results;

    OutputChannel.appendLine([
        'Deep Analysis All Files',
        `Deep Analysis : ${topFuncNum} Symbol`,
        `paramMapSize is ${paramMapSize}`,
        `valMapSize is ${valMapSize}`,
        `textMapSize is ${textMapSize}`,
        `All Size is ${paramMapSize + valMapSize + textMapSize}`,
        `Done in ${timeSpend} ms`,
    ].join('\n'));
    OutputChannel.show();
}

export function DeepAnalysisAllFiles(): null {
    const t1: number = Date.now();

    const need: CAhkFunc[] = [];
    for (const { uri, AhkSymbolList } of Detecter.DocMap.values()) { // keep output order is OK
        const DAList: CAhkFunc[] = getDAList(AhkSymbolList);
        need.push(...DAList);
        digDAFile(DAList, uri);
    }

    const t2: number = Date.now();
    showOutputChannel(WordFrequencyStatistics(need), t2 - t1);

    return null;
}

/*
my project:

Deep Analysis All Files
Deep Analysis : 744 Symbol
paramMapSize is 1922
valMapSize is 1960
textMapSize is 521
All Size is 4403
Done in 6 ms
*/
