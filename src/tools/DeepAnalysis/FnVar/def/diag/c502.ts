import { TC502New } from '../../../../../globalEnum';

export function newC502(oldRawName: string, RawName: string): TC502New {
    return oldRawName === RawName
        ? 0
        : RawName;
}
