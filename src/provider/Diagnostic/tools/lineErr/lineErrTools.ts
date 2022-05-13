import * as vscode from 'vscode';
import { Diags, EDiagCode } from '../../../../diag';
import { EDiagBase } from '../../../../Enum/EDiagBase';

export const enum EDiagLine {
    miss = 0,
    OK = 1,
}

export type TLineErrDiagParam = {
    lStr: string;
    lStrTrim: string;
    fistWordUp: string;
    line: number;
};

export class CNekoBaseLineDiag extends vscode.Diagnostic {
    declare public readonly source: EDiagBase.source;
    public constructor(
        {
            line,
            colL,
            colR,
            severity,
            tags,
            value,
        }: {
            line: number;
            colL: number;
            colR: number;
            severity: vscode.DiagnosticSeverity;
            tags: vscode.DiagnosticTag[];
            value: EDiagCode;
        },
    ) {
        const { msg, path } = Diags[value];
        const range: vscode.Range = new vscode.Range(line, colL, line, colR);
        const target = vscode.Uri.parse(path);

        super(range, msg, severity);
        this.tags = tags;
        this.source = EDiagBase.source;
        this.code = { value, target };
    }
}

export type TLineDiag = EDiagLine | CNekoBaseLineDiag;
