import * as vscode from 'vscode';
import { getGlobalValDef } from '../../../../core/getGlobalValDef';
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
    defLoc: vscode.Location;
};

export function wrapFnValDef({
    RawNameNew,
    valMap,
    lineType,
    defLoc,
}: TGetValue): TValAnalysis {
    const oldVal: TValAnalysis | undefined = valMap.get(RawNameNew.toUpperCase());
    if (oldVal) {
        oldVal.c502Array.push(newC502(oldVal.keyRawName, RawNameNew));
        oldVal.defLocList.push(defLoc);
        return oldVal;
    }

    const ahkValType = getGlobalValDef(RawNameNew.toUpperCase())
        ? EValType.global
        : lineType;
    return {
        keyRawName: RawNameNew,
        defLocList: [defLoc],
        refLocList: [],
        ahkValType,
        c502Array: [0],
    };
}
