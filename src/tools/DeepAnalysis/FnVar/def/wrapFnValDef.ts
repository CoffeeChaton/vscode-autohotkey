import * as vscode from 'vscode';
import { getGlobalValDef } from '../../../../core/getGlobalValDef';
import { EDiagCode } from '../../../../diag';
import {
    EValType,
    TAhkValType,
    TValAnalysis,
    TValMap,
} from '../../../../globalEnum';
import { setDiagnostic } from '../../../../provider/Diagnostic/setDiagnostic';

type TDiag502 = {
    oldVal: TValAnalysis;
    RawName: string;
    defLoc: vscode.Location;
    diagVal: vscode.Diagnostic[];
};

function diag502({
    oldVal,
    RawName,
    defLoc,
    diagVal,
}: TDiag502): number {
    const available = oldVal.code502Warn;
    if (available === 0) return 0;
    if (oldVal.keyRawName !== RawName) {
        const severity = vscode.DiagnosticSeverity.Warning;
        const diag = setDiagnostic(EDiagCode.code502, defLoc.range, severity, []);
        diagVal.push(diag);
        return available - 1;
    }
    return available;
}

type TGetValue = {
    RawName: string;
    valMap: TValMap;
    lineType: TAhkValType;
    defLoc: vscode.Location;
    diagVal: vscode.Diagnostic[];
    warnNumber: [number];
};

export function wrapFnValDef({
    RawName,
    valMap,
    lineType,
    defLoc,
    diagVal,
    warnNumber,
}: TGetValue): TValAnalysis {
    const oldVal: TValAnalysis | undefined = valMap.get(RawName.toUpperCase());
    if (oldVal) {
        const code502Warn = diag502({
            oldVal,
            RawName,
            defLoc,
            diagVal,
        });
        return {
            keyRawName: RawName,
            defLoc: [...oldVal.defLoc, defLoc],
            refLoc: [],
            ahkValType: oldVal.ahkValType,
            code502Warn,
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
        code502Warn: warnNumber[0],
    };
}
