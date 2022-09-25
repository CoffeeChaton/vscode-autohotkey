import * as vscode from 'vscode';
import type { TParamMapOut } from '../../../../AhkSymbol/CAhkFunc';
import { DiagsDA, EDiagCodeDA } from '../../../../diag';
import { CDiagFn } from '../../../../provider/Diagnostic/tools/CDiagFn';

export function c505ErrParamParsedError(paramMap: TParamMapOut, code505List: CDiagFn[]): void {
    for (const { parsedErrRange } of paramMap.values()) {
        if (parsedErrRange !== null) {
            code505List.push(
                new CDiagFn({
                    value: EDiagCodeDA.code505,
                    range: parsedErrRange,
                    severity: vscode.DiagnosticSeverity.Error,
                    tags: [],
                    message: DiagsDA[EDiagCodeDA.code505].msg,
                }),
            );
        }
    }
}
