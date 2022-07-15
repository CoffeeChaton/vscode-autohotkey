import type * as vscode from 'vscode';
import type { TValMapIn, TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { newC502 } from './diag/c502';

type TGetValue = {
    RawNameNew: string;
    valMap: TValMapIn;
    defRange: vscode.Range;
};

export function wrapFnValDef({
    RawNameNew,
    valMap,
    defRange,
}: TGetValue): TValMetaIn {
    const oldVal: TValMetaIn | undefined = valMap.get(RawNameNew.toUpperCase());
    if (oldVal !== undefined) {
        oldVal.c502Array.push(newC502(oldVal.keyRawName, RawNameNew));
        oldVal.defRangeList.push(defRange);
        return oldVal;
    }
    return {
        keyRawName: RawNameNew,
        defRangeList: [defRange],
        refRangeList: [],
        c502Array: [0],
    };
}
