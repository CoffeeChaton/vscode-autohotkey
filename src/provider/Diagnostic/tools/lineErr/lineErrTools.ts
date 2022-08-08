import type { CDiagBase } from '../CDiagBase';

export const enum EDiagLine {
    miss = 0,
    OK = 1,
}

export type TLineErrDiagParam = {
    lStr: string;
    lStrTrim: string;
    fistWordUp: string;
    line: number;
};

export type TLineDiag = CDiagBase | EDiagLine;
