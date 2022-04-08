import { TValMeta } from '../../TypeFnMeta';
import { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';

// VarSetCapacity(varName)
export function varSetCapacityFunc({
    lStr,
    valMap,
    line,
    paramMap,
}: TGetFnDefNeed): void {
    // eslint-disable-next-line no-magic-numbers
    if (lStr.length < 8) return; // 'NumGet('.length
    if (lStr.indexOf('(') === -1) return;
    // eslint-disable-next-line security/detect-unsafe-regex
    for (const v of lStr.matchAll(/(?<![.%`])\b(?:VarSetCapacity|NumGet)\b\(\s*&?(\w+)\b(?!\()/gui)) {
        const ch: number | undefined = v.index;
        if (ch === undefined) continue;

        const RawName: string = v[1];
        const UpName: string = RawName.toUpperCase();
        if (paramMap.has(UpName)) continue;

        const character: number = ch + v[0].indexOf(RawName); // "VarSetCapacity(".len ===  15

        const value: TValMeta = getValMeta(line, character, RawName, valMap);
        valMap.set(RawName.toUpperCase(), value);
    }
}
