/* eslint-disable no-magic-numbers */
import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getMenuFuncData(lStr: string, col: number): TScanData[] | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*GUI\b\s*,?\s*/iu, 'GUI,')
        .padStart(lStr.length, ' ');

    const arr: TScanData[] = spiltCommandAll(strF);
    // Gui, New , Options, Title
    // a0   a1    a2
    // eslint-disable-next-line no-magic-numbers
    if (arr.length < 3) return null;

    const a1: TScanData = arr[1];
    if ((/^add$/iu).test(a1.RawNameNew)) {
        // a0    a1   a2    a3
        // Gui, Add, Text, cBlue gLaunchGoogle, Click here to launch Google.
        //                 ^^^^^^^^^^^^^^^^^^^
        //                       ^^^^^^^^^^^^^
        const a3: TScanData | undefined = arr.at(3);
        if (a3 === undefined) return null;
        const { RawNameNew, lPos } = a3;

        const lStrFix: string = lStr.slice(lPos, lPos + RawNameNew.length);

        const list: TScanData[] = [];
        for (const ma of lStrFix.matchAll(/\bg(\w+)/giu)) {
            const { index } = ma;
            if (index === undefined) continue;
            const fnName: string = ma[1].trim();

            list.push({
                RawNameNew: fnName,
                lPos: index + lPos + 1, // +1 is gFuncName lPos is replace padStart
            });
        }
        return list;
    }

    return null;
}

/**
 * ```ahk
 * Gui, Add, Text, cBlue gLaunchGoogle, Click here to launch Google.
 * ;                      ^^^^^^^^^^^^
 * Gui, Add, Custom, ClassSysIPAddress32 r1 w150 hwndhIPControl gIPControlEvent
 * ;                                                             ^^^^^^^^^^^^^^
 * ;
 * ```
 * gLaunchGoogle <https://www.autohotkey.com/docs/v1/lib/GuiControls.htm#Text>
 * gIPControlEvent <https://www.autohotkey.com/docs/v1/lib/GuiControls.htm#Custom>
 *
 * G: GoSub (g-label). <https://www.autohotkey.com/docs/v1/lib/Gui.htm#Events>
 * <https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp/issues/17>
 */
export function getGuiFunc(AhkTokenLine: TAhkTokenLine): TScanData[] | null {
    const { fistWordUp } = AhkTokenLine;
    if (fistWordUp === 'GUI') {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return getMenuFuncData(lStr, fistWordUpCol);
    }

    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT' || fistWordUp === 'TRY') {
        const { SecondWordUp, SecondWordUpCol, lStr } = AhkTokenLine;
        return SecondWordUp === 'GUI'
            ? getMenuFuncData(lStr, SecondWordUpCol)
            : null;
    }

    return null;
}
