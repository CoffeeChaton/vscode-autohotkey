import * as vscode from 'vscode';
import {
    TAhkValType,
    TValAnalysis,
    TValMap,
} from '../../../../globalEnum';
import { newC502 } from './diag/c502';

type TGetValue = {
    RawNameNew: string;
    valMap: TValMap;
    lineType: TAhkValType;
    defRange: vscode.Range;
};

export function wrapFnValDef({
    RawNameNew,
    valMap,
    lineType,
    defRange,
}: TGetValue): TValAnalysis {
    const oldVal: TValAnalysis | undefined = valMap.get(RawNameNew.toUpperCase());
    if (oldVal !== undefined) {
        oldVal.c502Array.push(newC502(oldVal.keyRawName, RawNameNew));
        oldVal.defRangeList.push(defRange);
        return oldVal;
    }

    const ahkValType: TAhkValType = lineType;
    return {
        keyRawName: RawNameNew,
        defRangeList: [defRange],
        refRangeList: [],
        ahkValType,
        c502Array: [0],
    };
}
