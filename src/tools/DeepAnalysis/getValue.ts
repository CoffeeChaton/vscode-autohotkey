import * as vscode from 'vscode';
import { getGlobalValDef } from '../../core/getGlobalValDef';
import { EDiagCode } from '../../diag';
import {
    EValType,
    TAhkValType,
    TValAnalysis,
    TValMap,
} from '../../globalEnum';
import { setDiagnostic } from '../../provider/Diagnostic/setDiagnostic';

type TGetValue = {
    RawName: string;
    valMap: TValMap;
    lineType: TAhkValType;
    defLoc: vscode.Location;
    diagVal: vscode.Diagnostic[];
};

export function getValue({
    RawName,
    valMap,
    lineType,
    defLoc,
    diagVal,
}: TGetValue): TValAnalysis {
    const oldVal: TValAnalysis | undefined = valMap.get(RawName.toUpperCase());
    if (oldVal) {
        if (oldVal.keyRawName !== RawName) {
            const severity = vscode.DiagnosticSeverity.Warning;
            const tags = [vscode.DiagnosticTag.Unnecessary];
            const diag = setDiagnostic(EDiagCode.code502, defLoc.range, severity, tags);
            diagVal.push(diag);
        }
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
