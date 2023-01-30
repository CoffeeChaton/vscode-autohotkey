import type { TAhkTokenLine } from '../../../globalEnum';

/**
 * // TODO
 * if()   <---not \s to (, but also is foc
 * while()
 */

const focSet: ReadonlySet<string> = new Set(
    // src/tools/Built-in/statement.data.ts
    [
        // 'BREAK', does not affect the next line
        // 'CASE', useSwitchCase
        'CATCH',
        // 'CONTINUE', does not affect the next line
        // 'CRITICAL', does not affect the next line
        // 'DEFAULT', useSwitchCase
        'ELSE',
        // 'EXIT', does not affect the next line
        // 'EXITAPP', does not affect the next line
        'FINALLY',
        'FOR',
        // 'GoSub',
        // 'GOTO',
        'IF',
        'IfEqual',
        'IfExist',
        'IfGreater',
        'IfGreaterOrEqual',
        'IfInString',
        'IfLess',
        'IfLessOrEqual',
        'IfMsgBox',
        'IfNotEqual',
        'IfNotExist',
        'IfNotInString',
        'IfWinActive',
        'IfWinExist',
        'IfWinNotActive',
        'IfWinNotExist',
        'LOOP',
        // 'RETURN', does not affect the next line
        // 'SWITCH', useSwitchCase
        // 'THROW', useSwitchCase
        'TRY',
        'WHILE',
        // 'UNTIL',
    ].map((s: string): string => s.toUpperCase()),
);

export type TOccObj = {
    lockDeepList: number[],
    occ: number,
};

export function getDeepKeywords(lStrTrim: string, oldOccObj: TOccObj, AhkTokenLine: TAhkTokenLine): TOccObj {
    const { occ, lockDeepList } = oldOccObj;

    const { fistWordUp } = AhkTokenLine;
    if (focSet.has(fistWordUp)) {
        if (lStrTrim.endsWith('{')) {
            return { ...oldOccObj }; // managed by curly braces
        }
        const tempLockList: number[] = [...lockDeepList];

        const { deep2 } = AhkTokenLine;
        tempLockList.push(deep2.at(-1) ?? 0);

        return {
            lockDeepList: tempLockList,
            occ: occ + 1,
        };
    }

    const { cll } = AhkTokenLine;
    if (cll === 1) return { ...oldOccObj };

    //  const lockDeep: number[] = [...oldOccObj.lockDeepList];
    //  oneCommandCode < 0 // Math.max(oneCommandCode, 0);
    //     ? 0
    //     : oneCommandCode;
    return { ...oldOccObj, occ: 0 };
}

// FIXME fmt
// IfNotExist, %AhkScript%
//     if !iOption
//         Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """")
//     else return
// ;---end----
