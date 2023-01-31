/* eslint-disable max-lines-per-function */
import type { TAhkTokenLine } from '../../../globalEnum';
import type { TBrackets } from '../../../tools/Bracket';

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
    status: string,
};

function focElseCase(AhkTokenLine: TAhkTokenLine, oldOccObj: TOccObj): TOccObj {
    const {
        fistWordUpCol,
        SecondWordUp,
        lStr,
    } = AhkTokenLine;
    const lStrFix: string = lStr.slice(fistWordUpCol + SecondWordUp.length).trim();
    /**
     * else {
     * ;    ^ this
     *
     * else if() {
     * ;         ^ this
     */
    if (lStrFix.startsWith('{') || lStrFix.startsWith('{')) {
        return { ...oldOccObj }; // managed by curly braces
    }

    /**
     * else MsgBox % "hi hi"
     */
    const { occ, lockDeepList } = oldOccObj;
    const tempLockList: number[] = [...lockDeepList];

    const { deep2 } = AhkTokenLine;
    tempLockList.push(deep2.at(-1) ?? 0);

    // const occNew = occ > 0
    //     ? occ - 1
    //     : 0;

    return {
        lockDeepList: tempLockList,
        occ: occ + 1,
        status: '',
    }; // TODO
}
export function getDeepKeywords({
    lStrTrim,
    oldOccObj,
    AhkTokenLine,
    allFileBrackets,
}: {
    lStrTrim: string,
    oldOccObj: TOccObj,
    AhkTokenLine: TAhkTokenLine,
    allFileBrackets: readonly TBrackets[],
}): TOccObj {
    const { occ, lockDeepList } = oldOccObj;

    const { fistWordUp } = AhkTokenLine;

    if (focSet.has(fistWordUp)) {
        if (lStrTrim.endsWith('{')) return { ...oldOccObj }; // managed by curly braces

        if (fistWordUp === 'IF') {
            const { line } = AhkTokenLine;
            const ifBlockClose: boolean = allFileBrackets[line][2] === 0;
            if (!ifBlockClose) {
                /**
                 * if (a ; <---------not close
                 *  + b
                 *  + c
                 */
                const tempLockList: number[] = [...lockDeepList];

                const { deep2 } = AhkTokenLine;
                tempLockList.push(deep2.at(-1) ?? 0);

                return {
                    ...oldOccObj,
                    status: `not close at ln ${line}`, // TODO
                };
            }
            /**
             * 99% case
             * if (a ); <---------close
             *
             * or
             * oldIf case
             */
            const tempLockList: number[] = [...lockDeepList];

            const { deep2 } = AhkTokenLine;
            tempLockList.push(deep2.at(-1) ?? 0);

            return {
                lockDeepList: tempLockList,
                occ: occ + 1,
                status: '',
            };
        }
        if (fistWordUp === 'ELSE') {
            return focElseCase(AhkTokenLine, oldOccObj);
        }
        // other key word
        const tempLockList: number[] = [...lockDeepList];

        const { deep2 } = AhkTokenLine;
        tempLockList.push(deep2.at(-1) ?? 0);

        return {
            lockDeepList: tempLockList,
            occ: occ + 1,
            status: '',
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
