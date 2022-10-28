import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

export function getHotkeyData(lStr: string, fistWordUpCol: number): TScanData | null {
    // OK Hotkey, KeyName , Label, Options
    //                        ^
    // NG Hotkey, IfWinActive/Exist , WinTitle, WinText
    // NG Hotkey, If , Expression
    // NG Hotkey, If, % FunctionObject
    const strF: string = lStr
        .slice(fistWordUpCol)
        .replace(/^\s*\bHotkey\b\s*,?\s*/ui, 'Hotkey,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // eslint-disable-next-line no-magic-numbers
    if (arr.length < 3) return null;

    const [_a1, a2, a3] = arr;
    if ((/^if/ui).test(a2.RawNameNew)) return null;

    const { RawNameNew, lPos } = a3;

    if (!(/^\w+$/u).test(RawNameNew)) return null; // % FuncObj or %label%

    return {
        RawNameNew,
        lPos,
    };
}

const wm = new WeakMap<TAhkTokenLine, TScanData | null>();

export function getHotkeyWrap(AhkTokenLine: TAhkTokenLine): TScanData | null {
    const cache: TScanData | null | undefined = wm.get(AhkTokenLine);
    if (cache === null) return null;

    const { fistWordUp } = AhkTokenLine;
    if (fistWordUp === 'HOTKEY') {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        const ed: TScanData | null = getHotkeyData(lStr, fistWordUpCol);

        wm.set(AhkTokenLine, ed);
        return ed;
    }

    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT') {
        //
        const { lStr } = AhkTokenLine;
        const col: number = lStr.search(/:\s*\bHotkey\b/ui);
        if (col === -1) {
            wm.set(AhkTokenLine, null);
            return null;
        }
        const ed: TScanData | null = getHotkeyData(lStr, col + 1); // of ":".length

        wm.set(AhkTokenLine, ed);
        return ed;
    }

    return null;
}
