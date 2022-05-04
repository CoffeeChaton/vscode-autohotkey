import { TParamMapIn, TValMapIn } from '../../../AhkSymbol/CAhkFunc';
import { TGValMap } from '../../../core/ParserTools/ahkGlobalDef';

export type TGetFnDefNeed = {
    lStr: string;
    valMap: TValMapIn;
    line: number;
    paramMap: TParamMapIn;
    GValMap: TGValMap;
};
