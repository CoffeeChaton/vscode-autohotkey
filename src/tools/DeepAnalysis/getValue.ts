import * as vscode from 'vscode';
import { getGlobalValDef } from '../../core/getGlobalValDef';
import {
    EValType,
    TAhkValType,
    TValAnalysis,
    TValMap,
} from '../../globalEnum';

type TGetValue = {
    keyRawName: string;
    valMap: TValMap;
    lineType: TAhkValType;
    defLoc: vscode.Location;
};

export function getValue({
    keyRawName,
    valMap,
    lineType,
    defLoc,
}: TGetValue): TValAnalysis {
    const oldVal: TValAnalysis | undefined = valMap.get(keyRawName.toUpperCase());
    if (oldVal) {
        return {
            keyRawName,
            defLoc: [defLoc, ...oldVal.defLoc],
            refLoc: [],
            ahkValType: oldVal.ahkValType,
        };
    }

    const ahkValType = getGlobalValDef(keyRawName.toUpperCase())
        ? EValType.global
        : lineType;
    return {
        keyRawName,
        defLoc: [defLoc],
        refLoc: [],
        ahkValType,
    };
}
