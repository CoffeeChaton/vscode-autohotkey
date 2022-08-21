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
                if (
                    DocStrMap[func.range.start.line].displayErr
                    && fnErrCheck(DocStrMap, func, maxFnSize)
                ) {
                    digS.push(
                        new CDiagBase({
                            value: EDiagCode.code301,
                            range: func.selectionRange,
                            severity: vscode.DiagnosticSeverity.Warning,
                            tags: [],
                        }),
                    );
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
