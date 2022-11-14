import { cmd2Map } from '../../../Built-in/Command2';

function Param2List(defStr: string): number[] {
    const arr: number[] = [];

    for (const [i, s] of [...defStr].entries()) {
        if (s === 'O') {
            arr.push(i + 1);
        }
    }
    return arr;
}

const tempList = (
    (): [ReadonlyMap<string, number>, ReadonlyMap<string, number[]>, ReadonlyMap<string, number[]>] => {
        const outBaseMapRW = new Map<string, number>();
        const outPlusMapRW = new Map<string, number[]>();
        const inPutVarMapRw = new Map<string, number[]>();

        for (const [upKey, paramStr] of cmd2Map) {
            const paramList: number[] = Param2List(paramStr);
            //
            if (paramList.length === 1 && paramStr.startsWith('O')) {
                outBaseMapRW.set(upKey, upKey.length);
            } else if (paramList.length > 0) {
                outPlusMapRW.set(upKey, paramList);
            }

            if (paramStr.includes('I')) {
                inPutVarMapRw.set(upKey, paramList);
            }
        }

        return [outBaseMapRW, outPlusMapRW, inPutVarMapRw];
    }
)();

// TODO Catch, error
/**
 * @param cmd string -> upCaseString
 * @return number of cmd.len
 * exp:
 * ```ahk
 * EnvGet, v, %EnvVarName%
 * ```
 */
export const OutputCommandBaseMap = tempList[0];

/**
 * @param cmd string -> upCaseString
 * @return number[] of outPutList
 *
 * ```ahk
 * FileGetShortcut, Filespec, OutTarget, OutDir, OutArg, OutDescription, OutIcon, OutIconIndex, OutShowState.
 * ```
 * ref:
 * ```c++
 * {_T("FileGetShortcut"), 1, 8, 8 H, NULL}
 * ```
 */
export const OutputCommandPlusMap = tempList[1];

// TODO something help of user, exp: diag/hover/signature ...etc
export const inPutVarMap = tempList[2];
