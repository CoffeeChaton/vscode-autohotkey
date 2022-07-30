import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// VarSetCapacity(varName)
export function varSetCapacityFunc({
    lStr,
    valMap,
    line,
    paramMap,
    GValMap,
    lStrTrimLen,
    comment,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line no-magic-numbers
    if (lStrTrimLen < 8) return; // 'NumGet('.length
    if (!lStr.includes('(')) return;
    for (const v of lStr.matchAll(/(?<![.%`])\b(?:VarSetCapacity|NumGet)\b\(\s*&?(\w+)\b(?!\()/gui)) {
        const ch: number | undefined = v.index;
        if (ch === undefined) continue;

        const RawName: string = v[1];
        const UpName: string = RawName.toUpperCase();
        if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

        const character: number = ch + v[0].indexOf(RawName);

        const value: TValMetaIn = getValMeta(line, character, RawName, valMap, comment);
        valMap.set(RawName.toUpperCase(), value);
    }
}
