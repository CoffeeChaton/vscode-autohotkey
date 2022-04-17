import { TValMetaIn } from '../../../../globalEnum';
import { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// := the walrus operator
export function walrusOperator({
    lStr,
    valMap,
    line,
    paramMap,
    GValMap,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line no-magic-numbers
    if (lStr.trim().length < 4) return; // A:= ----> len 3
    if (lStr.indexOf(':=') === -1) return;

    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gu)) {
        const character: number | undefined = v.index;
        if (character === undefined) continue;

        const RawName: string = v[1];
        const UpName: string = RawName.toUpperCase();
        if (paramMap.has(UpName) || GValMap.has(UpName)) continue;

        const value: TValMetaIn = getValMeta(line, character, RawName, valMap);
        valMap.set(UpName, value);
    }
}

// Test OK     text := LT_bgColor_N := set_list := wait_time := Percentage := "Discard" ;clean
