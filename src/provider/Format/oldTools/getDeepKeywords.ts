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
    const { occ, lockList } = lnStatus;
    const lockOcc: number = occ;
    const lockDeep: number = AhkTokenLine.deep2.at(-1) ?? 0;

    return {
        lockList: [...lockList, { lockOcc, lockDeep }],
        occ,
        status: 'add lock',
    };
}

function focOccDiff({ lnStatus, AhkTokenLine }: {
    AhkTokenLine: TAhkTokenLine,
    matrixBrackets: readonly TBrackets[],
    lnStatus: TLnStatus,
}): TLnStatus {
    const { occ, lockList } = lnStatus;

    if (occ === 0) { // happy path
        return {
            lockList: [],
            occ: 0,
            status: 'old occ is 0',
        };
    }

    const tempLockList: TLockObj[] = [...lockList];

    const lastLock: TLockObj | undefined = tempLockList.pop();
    if (lastLock === undefined) {
        return {
            lockList: [],
            occ: 0,
            status: 'occ -> 0 as locList.len ===0',
        };
    }

    const { line, deep2 } = AhkTokenLine;
    const thisLineDeep = deep2.at(-1) ?? 0;
    const { lockDeep, lockOcc } = lastLock;
    if (thisLineDeep < lockDeep) {
        // console.log(`< at ln ${line}`);

        const newOcc = occ > 0
            ? occ - 1
            : 0;

        return {
            lockList: [...tempLockList],
            occ: newOcc,
            status: `occ-copy case--at deep <> lockDeep -- ln ${line}`,
        };
    }
    if (thisLineDeep !== lockDeep) {
        console.log(`!== case ln ${line}`);
    }

    let newOcc = occ - 1;
    if (newOcc < lockOcc) {
        newOcc = lockOcc;
        tempLockList.push(lastLock);
        return {
            lockList: tempLockList,
            occ: lockOcc,
            status: `occ-- case--51-- ln ${line} (trigger lock protection)`,
        };
    }

    if (lockOcc !== 0) {
        tempLockList.push(lastLock);
    }

    return {
        lockList: tempLockList,
        occ: lockOcc,
        status: `occ-- case--53-- ln ${line}`,
    };
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
        return focOccDiff({ AhkTokenLine, matrixBrackets, lnStatus });
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
    console.log(line, lnStatus);
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
        return { ...lnStatus, status: 'managed by multiline' }; // managed by multiline
    }

    const { cll } = AhkTokenLine;
    if (cll === 1) {
        return { ...lnStatus, status: 'continuation last line' };
    }

    return focOccDiff({ AhkTokenLine, matrixBrackets, lnStatus });
}

// FIXME fmt
// IfNotExist, %AhkScript%
//     if !iOption
//         Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """")
//     else return
// ;---end----
