import * as vscode from 'vscode';
import { getLintConfig } from '../../../configUI';
import { EDiagCode } from '../../../diag';
import {
    TAhkSymbol,
    TAhkSymbolList,
    TTokenStream,
} from '../../../globalEnum';
import { setDiagnostic } from './setDiagnostic';

function setFuncErr(func: TAhkSymbol): vscode.Diagnostic {
    const value = EDiagCode.code301;
    const range = func.selectionRange;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Warning, []);
}

function fnErrCheck(DocStrMap: TTokenStream, func: TAhkSymbol): boolean {
    const maxFnSize = getLintConfig().funcSize;
    let fnSize = 0;
    const st = func.selectionRange.end.line;
    const ed = func.range.end.line;
    if (ed - st < maxFnSize) return false;
    for (let line = st; line < ed; line++) {
        fnSize += DocStrMap[line].lStr === ''
            ? 0
            : 1;
        if (fnSize >= maxFnSize) return true;
    }
    return false;
}

export function getFuncErr(
    DocStrMap: TTokenStream,
    funcS: TAhkSymbolList,
    displayErr: readonly boolean[],
): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const func of funcS) {
        switch (func.kind) {
            case vscode.SymbolKind.Method:
            case vscode.SymbolKind.Function:
                if (
                    displayErr[func.range.start.line]
                    && fnErrCheck(DocStrMap, func)
                ) {
                    digS.push(setFuncErr(func));
                }
                break;
            case vscode.SymbolKind.Class:
                digS.push(...getFuncErr(DocStrMap, func.children, displayErr));
                break;
            default:
                break;
        }
    }
    return digS;
}
