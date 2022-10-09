import { FindExprDelim } from '../../../zFromCpp/FindExprDelim';

export type TScanData = {
    RawNameNew: string;
    lPos: number;
};

export function spiltCommandAll(lStr: string): TScanData[] {
    const lStrLen: number = lStr.length;

    const AllCut: TScanData[] = [];
    let make = -1;
    do {
        const oldMake: number = make + 1;
        make = FindExprDelim(lStr, ',', make + 1);
        const partStr: string = lStr.slice(oldMake, make);
        const RawNameNew: string = partStr.trim();

        AllCut.push({
            RawNameNew,
            lPos: oldMake + partStr.indexOf(RawNameNew),
        });
    } while (make !== lStrLen);

    return AllCut;
}
