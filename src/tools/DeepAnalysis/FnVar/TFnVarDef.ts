import { TGValMap } from '../../../core/ParserTools/ahkGlobalDef';
import { TParamMapIn, TValMapIn } from '../../../globalEnum';

export type TGetFnDefNeed = {
    lStr: string;
    valMap: TValMapIn;
    line: number;
    paramMap: TParamMapIn;
    GValMap: TGValMap;
};
