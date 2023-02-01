/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,4,-999] }] */
/* eslint-disable max-lines-per-function */
import type { TAhkTokenLine, TTokenStream } from '../../../globalEnum';
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

type TLockObj = {
    lockDeep: number,
    lockOcc: number,
};

export type TLnStatus = {
    lockList: readonly TLockObj[],
    occ: number,
    status: string,
};

function addLock({ lnStatus, AhkTokenLine }: {
    AhkTokenLine: TAhkTokenLine,
    lnStatus: TLnStatus,
}): TLnStatus {
    const lockOcc: number = lnStatus.occ;
    const lockDeep: number = AhkTokenLine.deep2.at(-1) ?? 0;

    return {
        lockList: [...lnStatus.lockList, { lockOcc, lockDeep }],
        occ: lnStatus.occ,
        status: 'add lock',
    };
}

function focOccDiff({ oldOccObj, AhkTokenLine }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    oldOccObj: TLnStatus,
}): TLnStatus {
    return {
        lockList: [],
        occ: 0,
        status: 'occ -> 0',
    };
    // FIXME
    // const { occ, lockDeepList } = oldOccObj;

    // if (occ === 0 || lockDeepList.length === 0) { // happy path
    //     return {
    //         lockDeepList: [],
    //         occ: 0,
    //         status: 'occ -> 0',
    //     };
    // }

    // const tempLockList: number[] = [...lockDeepList];

    // const occDiff: number | undefined = tempLockList.pop();
    // if (occDiff === undefined || occDiff === 0) {
    //     return {
    //         lockDeepList: [],
    //         occ: 0,
    //         status: 'occ -> 0',
    //     };
    // }

    // const { line, deep2 } = AhkTokenLine;

    // return {
    //     lockDeepList: tempLockList,
    //     occ: 0, // FIXME:
    //     status: `occ-- at ln ${line}`,
    // };
}

function forIfCase({ AhkTokenLine, matrixBrackets, lnStatus }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    lnStatus: TLnStatus,
}): TLnStatus {
    const { line } = AhkTokenLine;

    /**
     * if (a ; <---------not close
     *  + b
     *  + c
     */
    const ifBlockClose: boolean = matrixBrackets[line][2] === 0;
    if (!ifBlockClose) {
        return {
            ...lnStatus,
            status: `if ( ,not close at ln ${line}`, // TODO
        };
    }

    /**
     * 99% case
     * if (a ); <---------close
     *
     * or
     * oldIf case
     */
    const { occ, lockList } = lnStatus;
    return {
        lockList: [...lockList],
        occ: occ + 1,
        status: 'if () case',
    };
}

function focElseCase({ AhkTokenLine, matrixBrackets, lnStatus }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    lnStatus: TLnStatus,
}): TLnStatus {
    const { lStr, fistWordUpCol } = AhkTokenLine;

    /**
     * 1. end if     -> forIfCase
     * 2. else return
     * 3. else foo()
     */
    const afterElseStr = lStr.slice(fistWordUpCol + 4)
        .replace(/^\s*,/u, '') // fix ----> "else," WTF?
        .trim();
    if (afterElseStr.length > 0) {
        // check start with 'if' case
        if ((/^if(?:\s|\()/iu).test(afterElseStr)) {
            return forIfCase({ AhkTokenLine, matrixBrackets, lnStatus });
        }
        return focOccDiff({ AhkTokenLine, matrixBrackets, oldOccObj: lnStatus });
    }

    /**
     * else ;nothings <--- after else not any string
     */
    const { occ, lockList } = lnStatus;
    return {
        lockList: [...lockList],
        occ: occ + 1,
        status: 'else end with spec',
    };
}

export function getDeepKeywords({
    lStrTrim,
    lnStatus,
    AhkTokenLine,
    matrixBrackets,
    DocStrMap,
}: {
    lStrTrim: string,
    lnStatus: TLnStatus,
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    DocStrMap: TTokenStream,
}): TLnStatus {
    const { occ } = lnStatus;

    const { fistWordUp, line } = AhkTokenLine;
    //  console.log(line, oldOccObj);
    if (focSet.has(fistWordUp)) {
        if (lStrTrim.endsWith('{')) return addLock({ lnStatus, AhkTokenLine }); // managed by curly braces
        const nextLine: TAhkTokenLine | undefined = DocStrMap.at(line + 1);
        if (nextLine === undefined) {
            return {
                lockList: [],
                occ: 0,
                status: 'end of file',
            };
        }
        if (nextLine.lStr.trim().startsWith('{')) return addLock({ lnStatus, AhkTokenLine }); // managed by curly braces

        if (fistWordUp === 'IF') return forIfCase({ AhkTokenLine, matrixBrackets, lnStatus });
        if (fistWordUp === 'ELSE') return focElseCase({ AhkTokenLine, matrixBrackets, lnStatus });

        // other key word
        const { lockList } = lnStatus;
        return {
            lockList: [...lockList],
            occ: occ + 1,
            status: `other key word+ "${fistWordUp}"`,
        };
    }

    const nextLine: TAhkTokenLine | undefined = DocStrMap.at(line + 1);
    if (nextLine === undefined) {
        return {
            lockList: [],
            occ: 0,
            status: 'end of file part2',
        };
    }
    if (nextLine.multilineFlag !== null) {
        return { ...lnStatus }; // managed by multiline
    }

    const { cll } = AhkTokenLine;
    if (cll === 1) {
        return { ...lnStatus };
    }

    return focOccDiff({ AhkTokenLine, matrixBrackets, oldOccObj: lnStatus });
}

// FIXME fmt
// IfNotExist, %AhkScript%
//     if !iOption
//         Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """")
//     else return
// ;---end----
