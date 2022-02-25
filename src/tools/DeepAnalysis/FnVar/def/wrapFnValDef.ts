import * as vscode from 'vscode';
import { getGlobalValDef } from '../../../../core/getGlobalValDef';
import {
    EValType,
    TAhkValType,
    TC502,
    TValAnalysis,
    TValMap,
} from '../../../../globalEnum';

function newC502(oldVal: TValAnalysis, RawName: string, defLoc: vscode.Location): TC502[] {
    if (oldVal.keyRawName !== RawName) {
        const newWarn: TC502 = {
            varName: RawName, // case sensitivity;
            loc: defLoc,
        };
        return [...oldVal.c502List, newWarn];
    }
    return [...oldVal.c502List];
}

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
