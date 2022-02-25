import * as vscode from 'vscode';
import { getGlobalValDef } from '../../../../core/getGlobalValDef';
import {
    EValType,
    TAhkValType,
    TValAnalysis,
    TValMap,
} from '../../../../globalEnum';

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
            keyRawName: RawName,
            defLoc: [...oldVal.defLoc, defLoc],
            refLoc: [],
            ahkValType: oldVal.ahkValType,
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
    };
}
