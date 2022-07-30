import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import type { TTokenStream } from '../../../globalEnum';
import { EDiagDeep } from '../../../globalEnum';
import { setDiagnostic } from './setDiagnostic';

export function getDeepErr(DocStrMap: TTokenStream): vscode.Diagnostic[] {
    return DocStrMap
        .filter(({ diagDeep }) => diagDeep !== EDiagDeep.none)
        .map(({ line, diagDeep, textRaw }): vscode.Diagnostic => {
            const value: EDiagCode = EDiagDeep.multL === diagDeep
                ? EDiagCode.code908
                : EDiagCode.code909;

            const range: vscode.Range = new vscode.Range(
                line,
                0,
                line,
                textRaw.length,
            );
            return setDiagnostic(value, range, vscode.DiagnosticSeverity.Warning, []);
        });
}
