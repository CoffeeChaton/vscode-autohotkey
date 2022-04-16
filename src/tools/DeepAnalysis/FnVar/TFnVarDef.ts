import { TGValMap } from '../../../core/ParserTools/ahkGlobalDef';
import { TParamMap, TValMap } from '../TypeFnMeta';

export type TGetFnDefNeed = {
    lStr: string;
    valMap: TValMap;
    line: number;
    paramMap: TParamMap;
    GValMap: TGValMap;
};
