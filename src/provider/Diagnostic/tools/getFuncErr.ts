import * as vscode from 'vscode';
import type { TAhkSymbol, TAhkSymbolList } from '../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../diag';
import type { TTokenStream } from '../../../globalEnum';
import { setDiagnostic } from './setDiagnostic';

function fnErrCheck(DocStrMap: TTokenStream, func: TAhkSymbol, maxFnSize: number): boolean {
    const st = func.selectionRange.end.line;
    const ed = func.range.end.line;
    if (ed - st < maxFnSize) return false;

    let fnSize = 0;
    for (let line = st; line < ed; line++) {
        if (DocStrMap[line].lStr === '') continue;
        fnSize++;
        if (fnSize >= maxFnSize) return true;
    }
    return false;
}

export function getFuncErr(
    DocStrMap: TTokenStream,
    funcS: TAhkSymbolList,
    displayErr: readonly boolean[],
    maxFnSize: number,
): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const func of funcS) {
        switch (func.kind) {
            case vscode.SymbolKind.Method:
            case vscode.SymbolKind.Function:
                if (
                    displayErr[func.range.start.line]
                    && fnErrCheck(DocStrMap, func, maxFnSize)
                ) {
                    digS.push(
                        setDiagnostic(EDiagCode.code301, func.selectionRange, vscode.DiagnosticSeverity.Warning, []),
                    );
                }
                break;
            case vscode.SymbolKind.Class:
                digS.push(...getFuncErr(DocStrMap, func.children, displayErr, maxFnSize));
                break;
            default:
                break;
        }
    }
    return digS;
}
