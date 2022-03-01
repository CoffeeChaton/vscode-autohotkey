import {
    ESnippetRecBecause,
    TArgMap,
    TSnippetRecMap,
} from '../../../../globalEnum';

export function setParaRec(suggestMap: TSnippetRecMap, argMap: TArgMap, inputStr: string): void {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    for (const [_upName, ArgAnalysis] of argMap) {
        // startsWith
        if (ArgAnalysis.keyRawName.startsWith(inputStr)) {
            suggestMap.set(ArgAnalysis.keyRawName, ESnippetRecBecause.paramStartWith);
            continue;
        }

        // arg Never user
        if (ArgAnalysis.refLocList.length === 0) {
            suggestMap.set(ArgAnalysis.keyRawName, ESnippetRecBecause.paramNeverUsed);
        }
    }
}
