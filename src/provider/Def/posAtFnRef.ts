import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../globalEnum';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { fnRefLStr, fnRefTextRaw } from './getFnRef';

/**
* ```ahk
* c := c();
* ;No   Yes check pos at like func()

* c := c();
* ;    ^
* "c" c c() "c" c c "c("
* ;^    ^    ^
*
* c(){
* ;^
* }
* ```
*/
export function posAtFnRef(
    {
        AhkTokenLine,
        position,
        wordUp,
    }: {
        AhkTokenLine: TAhkTokenLine,
        position: vscode.Position,
        wordUp: string,
    },
): boolean {
    const { character } = position;
    const len: number = wordUp.length;
    for (const { upName, col } of [...fnRefLStr(AhkTokenLine), ...fnRefTextRaw(AhkTokenLine)]) {
        if (upName === wordUp && (character >= col || character <= col + len)) return true;
    }

    const setTimerData: TScanData | null = getSetTimerWrap(AhkTokenLine);
    if (setTimerData !== null) return true;

    const HotkeyData: TScanData | null = getHotkeyWrap(AhkTokenLine);
    if (HotkeyData !== null) return true;

    return false;
}
