import { TC502New, TValAnalysis } from '../../../../../globalEnum';

export function newC502(oldVal: TValAnalysis, RawName: string): TC502New {
    return oldVal.keyRawName === RawName
        ? 0
        : RawName;
}
