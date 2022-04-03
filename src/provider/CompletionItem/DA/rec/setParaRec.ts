import { ESnippetRecBecause, TSnippetRecMap } from '../../../../globalEnum';
import { TArgMap } from '../../../../tools/DeepAnalysis/FnMetaType';

export function setParaRec(suggestMap: TSnippetRecMap, argMap: TArgMap, inputStr: string): void {
    for (const ArgAnalysis of argMap.values()) {
        // startsWith
        if (ArgAnalysis.keyRawName.startsWith(inputStr)) {
            suggestMap.set(ArgAnalysis.keyRawName, ESnippetRecBecause.paramStartWith);
            continue;
        }

        // arg Never user
        if (ArgAnalysis.refRangeList.length === 0) {
            suggestMap.set(ArgAnalysis.keyRawName, ESnippetRecBecause.paramNeverUsed);
        }
    }
}
