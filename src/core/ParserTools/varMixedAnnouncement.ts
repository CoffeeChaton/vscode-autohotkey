import { spiltCommandAll } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

export type TVarData = {
    rawName: string;
    ch: number;
};

function isLookLikeVar(rawName: string): boolean {
    return (
        !(
            !(/^\w+$/u).test(rawName)
            || (/^_+$/u).test(rawName) // str
            || (/^\d+$/u).test(rawName) // just number
            || (/^0X[\dA-F]+$/ui).test(rawName)
        ) // NumHexConst = 0 x [0-9a-fA-F]+
    );
}

type TVarDataResult = {
    varDataList: TVarData[];
    objDeep: number;
};

function matchStr(RawNameNew: string, key: string): number {
    let i = 0;
    for (const str of RawNameNew) {
        if (str === key) i++;
    }
    return i;
}

/**
 * ```ahk
 * static li := {btn: {oc:1, ari:2, ync:3, yn:4, rc:5, ctc:6}, ico: {"x":16, "?":32, "!":48, "i":64}},b9,c5
 *
 * li,b9,c5 is variable
 * ```
 */
export function varMixedAnnouncement(strF: string, objDeepRaw: number): TVarDataResult {
    const varDataList: TVarData[] = [];

    let objDeep = objDeepRaw;
    for (const { RawNameNew, lPos } of spiltCommandAll(strF)) {
        if (RawNameNew.includes('{')) objDeep += matchStr(RawNameNew, '{');
        if (RawNameNew.includes('}')) objDeep -= matchStr(RawNameNew, '}');

        if (RawNameNew.includes(':=')) {
            for (const ma of RawNameNew.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gui)) {
                const rawName: string = ma[1].trim();
                if (isLookLikeVar(rawName)) {
                    varDataList.push({
                        rawName,
                        ch: lPos + RawNameNew.indexOf(rawName, ma.index),
                    });
                }
            }
        } else if (objDeep === 0) {
            const rawName: string = RawNameNew.trim();
            if (isLookLikeVar(rawName)) {
                varDataList.push({
                    rawName,
                    ch: lPos + RawNameNew.indexOf(rawName),
                });
            }
        }
    }

    return {
        varDataList,
        objDeep,
    };
}
