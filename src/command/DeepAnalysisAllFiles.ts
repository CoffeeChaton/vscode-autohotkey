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
Deep Analysis : 744 Symbol
paramMapSize is 1922
valMapSize is 2033 ;2030->2033 add `catch err`
textMapSize is 437
All Size is 4392
Done in 4 ms
*/
