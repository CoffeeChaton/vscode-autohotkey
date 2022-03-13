import * as vscode from 'vscode';
import { getGlobalValDef } from '../../../../core/Global';
import {
    EValType,
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
    if (oldVal) {
        oldVal.c502Array.push(newC502(oldVal.keyRawName, RawNameNew));
        oldVal.defRangeList.push(defRange);
        return oldVal;
    }

    const ahkValType = getGlobalValDef(RawNameNew.toUpperCase())
        ? EValType.global
        : lineType;
    if (EValType.global === ahkValType) {
        // if normal color -> getGlobalValDef
        // else if local color -> check has input global
        // TODO line color -> isLocal -> check all input
        // else key by key check Global
        console.log('🚀 ~ RawNameNew', RawNameNew);
    }
    return {
        keyRawName: RawNameNew,
        defRangeList: [defRange],
        refRangeList: [],
        ahkValType,
        c502Array: [0],
    };
}
