/* eslint no-magic-numbers: ["error", { "ignore": [-5,0,5] }] */
import type { TValMapOut } from '../../../../AhkSymbol/CAhkFunc';
import type { TSnippetRecMap } from '../ESnippetRecBecause';
import { ESnippetRecBecause } from '../ESnippetRecBecause';

export function setVarRec(Rec: TSnippetRecMap, valMap: TValMapOut, inputStr: string): void {
    for (const ValAnalysis of valMap.values()) {
        const { keyRawName } = ValAnalysis;

        if (keyRawName.startsWith(inputStr)) {
            Rec.set(keyRawName, ESnippetRecBecause.varStartWith);
            continue;
        }
    }
}
