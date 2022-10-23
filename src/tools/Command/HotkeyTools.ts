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
        .replace(/^\bHotkey\b\s*,?\s*/ui, 'Hotkey,')
        .padStart(lStr.length, ' ');

    // TODO of fistWordUp is case/default

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
