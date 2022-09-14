import * as vscode from 'vscode';
import type { TAhkSymbol, TAhkSymbolList } from '../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../diag';
import type { TTokenStream } from '../../../globalEnum';
import { CDiagBase } from './CDiagBase';

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

function FunctionNameTooLong(func: TAhkSymbol): boolean {
    //  if (aFuncNameLength > MAX_VAR_NAME_LENGTH)
    // {
    //  ScriptError(_T("Function name too long."), aFuncName);
    //  return NULL;
    // }

    const MAX_VAR_NAME_LENGTH = 0xFF;
    return func.name.length > (MAX_VAR_NAME_LENGTH - 2);
}

export function getFuncErr(
    DocStrMap: TTokenStream,
    funcCh: TAhkSymbolList,
    maxFnSize: number,
): CDiagBase[] {
    const digS: CDiagBase[] = [];
    for (const func of funcCh) {
        switch (func.kind) {
            case vscode.SymbolKind.Method:
            case vscode.SymbolKind.Function:
                if (DocStrMap[func.range.start.line].displayErr) {
                    if (fnErrCheck(DocStrMap, func, maxFnSize)) {
                        digS.push(
                            new CDiagBase({
                                value: EDiagCode.code301,
                                range: func.selectionRange,
                                severity: vscode.DiagnosticSeverity.Warning,
                                tags: [],
                            }),
                        );
                    } else if (FunctionNameTooLong(func)) { // edge case...
                        digS.push(
                            new CDiagBase({
                                value: EDiagCode.code302,
                                range: func.selectionRange,
                                severity: vscode.DiagnosticSeverity.Warning,
                                tags: [],
                            }),
                        );
                    }
                }
                break;
            case vscode.SymbolKind.Class:
                digS.push(...getFuncErr(DocStrMap, func.children, maxFnSize));
                break;
            default:
                break;
        }
    }
    return digS;
}
