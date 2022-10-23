import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

export function getSetTimerData(lStr: string, fistWordUpCol: number): TScanData | null {
    // SetTimer , Label_or_fnName, PeriodOnOffDelete, Priority
    // SetTimer , , PeriodOnOffDelete, Priority

    const strF: string = lStr
        .slice(fistWordUpCol)
        .replace(/^\bSetTimer\b\s*,?\s*/ui, 'SetTimer,')
        .padStart(lStr.length, ' ');

    // TODO of fistWordUp is case/default

    const arr: TScanData[] = spiltCommandAll(strF);
    if (arr.length < 2) return null;

    const [_a1, a2] = arr;

    const { RawNameNew, lPos } = a2;

    if (!(/^\w+$/u).test(RawNameNew)) return null; // % FuncObj or %label%

    return {
        RawNameNew,
        lPos,
    };
}
