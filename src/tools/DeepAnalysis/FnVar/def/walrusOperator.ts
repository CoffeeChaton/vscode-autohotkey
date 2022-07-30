import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// := the walrus operator
export function walrusOperator({
    lStr,
    valMap,
    line,
    paramMap,
    GValMap,
    lStrTrimLen,
    comment,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line no-magic-numbers
    if (lStrTrimLen < 4) return; // A:= ----> len 3
    if (!lStr.includes(':=')) return;

    for (const v of lStr.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gu)) {
        const character: number | undefined = v.index;
        if (character === undefined) continue;

        const RawName: string = v[1];
        const UpName: string = RawName.toUpperCase();
        if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

        const value: TValMetaIn = getValMeta(line, character, RawName, valMap, comment);
        valMap.set(UpName, value);
    }
}

// Test OK     text := LT_bgColor_N := set_list := wait_time := Percentage := "Discard" ;clean
