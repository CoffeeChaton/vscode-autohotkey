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
    RawName: string;
    valMap: TValMap;
    lineType: TAhkValType;
    defLoc: vscode.Location;
};

export function wrapFnValDef({
    RawName,
    valMap,
    lineType,
    defLoc,
}: TGetValue): TValAnalysis {
    const oldVal: TValAnalysis | undefined = valMap.get(RawName.toUpperCase());
    if (oldVal) {
        return {
            keyRawName: oldVal.keyRawName,
            defLoc: [...oldVal.defLoc, defLoc],
            refLoc: [],
            ahkValType: oldVal.ahkValType,
            c502List: newC502(oldVal, RawName, defLoc),
        };
    }

    const ahkValType = getGlobalValDef(RawName.toUpperCase())
        ? EValType.global
        : lineType;
    return {
        keyRawName: RawName,
        defLoc: [defLoc],
        refLoc: [],
        ahkValType,
        c502List: [],
    };
}
