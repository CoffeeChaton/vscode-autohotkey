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

// FIXME: var := {obj:something, k:v}
export function varMixedAnnouncement(strF: string): TVarData[] {
    const varDataList: TVarData[] = [];

    for (const { RawNameNew, lPos } of spiltCommandAll(strF)) {
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
        } else {
            const rawName: string = RawNameNew.trim();
            if (isLookLikeVar(rawName)) {
                varDataList.push({
                    rawName,
                    ch: lPos + RawNameNew.indexOf(rawName),
                });
            }
        }
    }

    return varDataList;
}
