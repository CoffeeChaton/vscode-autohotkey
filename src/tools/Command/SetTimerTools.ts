import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getSetTimerData(lStr: string, fistWordUpCol: number): TScanData | null {
    // SetTimer , Label_or_fnName, PeriodOnOffDelete, Priority
    // SetTimer , , PeriodOnOffDelete, Priority

    const strF: string = lStr
        .slice(fistWordUpCol)
        .replace(/^\s*\bSetTimer\b\s*,?\s*/ui, 'SetTimer,')
        .padStart(lStr.length, ' ');

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

const wm = new WeakMap<TAhkTokenLine, TScanData | null>();

export function getSetTimerWrap(AhkTokenLine: TAhkTokenLine): TScanData | null {
    const cache: TScanData | null | undefined = wm.get(AhkTokenLine);
    if (cache === null) return null;

    const { fistWordUp } = AhkTokenLine;
    if (fistWordUp === 'SETTIMER') {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        const ed: TScanData | null = getSetTimerData(lStr, fistWordUpCol);

        wm.set(AhkTokenLine, ed);
        return ed;
    }

    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT') {
        //
        const { lStr } = AhkTokenLine;
        const col: number = lStr.search(/:\s*\bSetTimer\b/ui);
        if (col === -1) {
            wm.set(AhkTokenLine, null);
            return null;
        }
        const ed: TScanData | null = getSetTimerData(lStr, col + 1); // of ":".length

        wm.set(AhkTokenLine, ed);
        return ed;
    }

    return null;
}
