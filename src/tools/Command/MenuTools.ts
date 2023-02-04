/* eslint-disable no-magic-numbers */
import type { TAhkTokenLine } from '../../globalEnum';
import type { TScanData } from '../DeepAnalysis/FnVar/def/spiltCommandAll';
import { spiltCommandAll } from '../DeepAnalysis/FnVar/def/spiltCommandAll';

function getMenuFuncData(lStr: string, col: number): TScanData | null {
    const strF: string = lStr
        .slice(col)
        .replace(/^\s*Menu\b\s*,?\s*/iu, 'Menu,')
        .padStart(lStr.length, ' ');
    // Menu, MenuName, Add , MenuItemName, LabelOrSubmenu, Options
    //                ^^^^                 ^^^^^^^^^^^^^^
    // a1    a2        a3       a4         a5              a6
    // Menu, MenuName, Insert , MenuItemName, ItemToInsert, LabelOrSubmenu, Options
    //                 a3                      a5           a6
    const arr: TScanData[] = spiltCommandAll(strF);
    // eslint-disable-next-line no-magic-numbers
    if (arr.length < 5) return null;
    console.log(arr);

    const a3: TScanData = arr[2];
    if ((/^add$/iu).test(a3.RawNameNew)) {
        const a5: TScanData | undefined = arr.at(4);
        if (a5 === undefined) return null;
        const { RawNameNew, lPos } = a5;

        if (!(/^\w+$/u).test(RawNameNew)) return null; // % FuncObj or %label%

        return {
            RawNameNew,
            lPos,
        };
    }

    if ((/^Insert$/iu).test(a3.RawNameNew)) {
        const a6: TScanData | undefined = arr.at(5);
        if (a6 === undefined) return null;
        const { RawNameNew, lPos } = a6;

        if (!(/^\w+$/u).test(RawNameNew)) return null; // % FuncObj or %label%

        return {
            RawNameNew,
            lPos,
        };
    }
    return null;
}

/**
 * ```ahk
 * Menu, MenuName,     Add, MenuItemName                , LabelOrSubmenu
 * Menu, OpenWithMenu, Add, &Choose external application, browseExternalApp
 * ;------------------------------------------------------^^^^^^^^^^^^^^is label/func name
 * ```
 * <https://www.autohotkey.com/docs/v1/misc/Labels.htm#Functions>
 */
export function getMenuFunc(AhkTokenLine: TAhkTokenLine): TScanData | null {
    const { fistWordUp } = AhkTokenLine;
    if (fistWordUp === 'MENU') {
        const { lStr, fistWordUpCol } = AhkTokenLine;
        return getMenuFuncData(lStr, fistWordUpCol);
    }

    if (fistWordUp === 'CASE' || fistWordUp === 'DEFAULT' || fistWordUp === 'TRY') {
        const { SecondWordUp, SecondWordUpCol, lStr } = AhkTokenLine;
        return SecondWordUp === 'MENU'
            ? getMenuFuncData(lStr, SecondWordUpCol)
            : null;
    }

    return null;
}
