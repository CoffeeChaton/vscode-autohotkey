import type * as vscode from 'vscode';
import type { TAhkTokenLine } from '../../globalEnum';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

export function posAtFnRef(
    {
        AhkTokenLine,
        document,
        position,
        wordUp,
    }: {
        AhkTokenLine: TAhkTokenLine,
        document: vscode.TextDocument,
        position: vscode.Position,
        wordUp: string,
    },
): boolean {
    // funcName( | "funcName"
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regBase = new RegExp(
        `(?:(?<![.\`%#])\\b(${wordUp})\\b\\()|(?:(?<=")(${wordUp})")`,
        //                          funcName(                  "funcName"
        // --------------------------------------------------- RegisterCallback("funcName") or Func("funcName")
        'giu',
    );

    // i want to keep some case can goto def, but not ref
    // case 1
    //    ;funcName <- not ref, but can goto def
    //
    // case 2
    //    msgBox,
    //        (
    //            funcName() <- not ref, but can goto def
    //        )
    //
    // case 3

    if (document.getWordRangeAtPosition(position, regBase) !== undefined) return true;
    // c := c();
    // No   Yes check pos at like func()

    // if want accurate
    //
    // for (const { upName, col } of [...fnRefLStr(AhkTokenLine), ...fnRefTextRaw(AhkTokenLine)]) {
    //     if (upName === wordUp && (character >= col || character <= col + len)) return true;
    // }

    const setTimerData: TScanData | null = getSetTimerWrap(AhkTokenLine);
    if (setTimerData !== null) return true;

    const HotkeyData: TScanData | null = getHotkeyWrap(AhkTokenLine);
    if (HotkeyData !== null) return true;

    return false;
}
