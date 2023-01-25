import type { CAhkFunc } from '../AhkSymbol/CAhkFunc';
import { pm } from '../core/ProjectManager';
import { setBaseDiag } from '../provider/Diagnostic/setBaseDiag';
import { digDAFile } from '../tools/DeepAnalysis/Diag/digDAFile';
import { getDAListTop } from '../tools/DeepAnalysis/getDAList';
import { WordFrequencyStatistics } from './tools/WordFrequencyStatistics';

export function DeepAnalysisAllFiles(): null {
    const t1: number = Date.now();

    const ahkFnList: CAhkFunc[] = [];
    for (
        const {
            uri,
            AST,
            DocStrMap,
            ModuleVar,
        } of pm.DocMap.values()
    ) { // keep output order is OK
        const DAList: readonly CAhkFunc[] = getDAListTop(AST);
        ahkFnList.push(...DAList);
        setBaseDiag(uri, DocStrMap, AST);
        digDAFile(DAList, ModuleVar, uri, DocStrMap);
    }

    WordFrequencyStatistics(ahkFnList, Date.now() - t1);

    return null;
}

/*
my project:

Problems (Ctrl+Shift+M) - Total 84 Problems

Deep Analysis All Files
Deep Analysis : 745 Symbol, function : 665 , method: 80
paramMapSize is 1926
valMapSize is 2033
textMapSize is 434
All Size is 4393
Done in 3 ms
*/
