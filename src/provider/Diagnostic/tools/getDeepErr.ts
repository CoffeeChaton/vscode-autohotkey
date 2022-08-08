import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import type { TTokenStream } from '../../../globalEnum';
import { EDiagDeep } from '../../../globalEnum';
import { CDiagBase } from './CDiagBase';

export function getDeepErr(DocStrMap: TTokenStream): CDiagBase[] {
    return DocStrMap
        .filter(({ diagDeep }) => diagDeep !== EDiagDeep.none)
        .map(({ line, diagDeep, textRaw }): CDiagBase => {
            const value: EDiagCode = EDiagDeep.multL === diagDeep
                ? EDiagCode.code908
                : EDiagCode.code909;

            return new CDiagBase({
                value,
                range: new vscode.Range(line, 0, line, textRaw.length),
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [],
            });
        });
}
