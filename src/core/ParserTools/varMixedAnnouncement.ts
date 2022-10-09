import { spiltCommandAll } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';

export type TVarData = {
    rawName: string;
    ch: number;
};

export function varMixedAnnouncement(strF: string): TVarData[] {
    const varDataList: TVarData[] = [];

    for (const { RawNameNew, lPos } of spiltCommandAll(strF)) {
        if (RawNameNew.includes(':=')) {
            for (const ma of RawNameNew.matchAll(/(?<![.`%])\b(\w+)\b\s*:=/gui)) {
                const rawName: string = ma[1].trim();
                varDataList.push({
                    rawName,
                    ch: lPos + RawNameNew.indexOf(rawName, ma.index),
                });
            }
        } else {
            const rawName: string = RawNameNew.trim();
            varDataList.push({
                rawName,
                ch: lPos + RawNameNew.indexOf(rawName),
            });
        }
    }

    return varDataList;
}
