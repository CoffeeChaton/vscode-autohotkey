import { ESnippetRecBecause, TSnippetRecMap } from '../../../../globalEnum';
import { TParamMap } from '../../../../tools/DeepAnalysis/TypeFnMeta';

export function setParaRec(suggestMap: TSnippetRecMap, paramMap: TParamMap, inputStr: string): void {
    for (const paramMeta of paramMap.values()) {
        // startsWith
        if (paramMeta.keyRawName.startsWith(inputStr)) {
            suggestMap.set(paramMeta.keyRawName, ESnippetRecBecause.paramStartWith);
            continue;
        }

        // arg Never user
        if (paramMeta.refRangeList.length === 0) {
            suggestMap.set(paramMeta.keyRawName, ESnippetRecBecause.paramNeverUsed);
        }
    }
}
