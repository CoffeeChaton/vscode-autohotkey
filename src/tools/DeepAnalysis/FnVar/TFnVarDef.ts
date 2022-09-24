import type { TParamMapIn, TValMapIn } from '../../../AhkSymbol/CAhkFunc';
import type { TGValMap } from '../../../core/ParserTools/ahkGlobalDef';

export type TGetFnDefNeed = {
    lStr: string;
    valMap: TValMapIn;
    line: number;
    paramMap: TParamMapIn;
    GValMap: TGValMap;
    lStrTrimLen: number;
    lineComment: string;
};
