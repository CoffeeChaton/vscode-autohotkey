import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import type { TAhkTokenLine, TPos, TTokenStream } from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';
import { CDiagBase } from './CDiagBase';

type TDiagCodeAllow =
    | EDiagCode.code120
    | EDiagCode.code121
    | EDiagCode.code122
    | EDiagCode.code123;

function fnMakeDiag(Pos: TPos, value: TDiagCodeAllow, line: number, severity: vscode.DiagnosticSeverity): CDiagBase {
    //
    const { col, len } = Pos;
    return new CDiagBase({
        value,
        range: new vscode.Range(line, col, line, col + len),
        severity,
        tags: [],
    });
}

function getMultilineDiagOfLine(params: TAhkTokenLine): CDiagBase[] {
    const {
        multiline,
        multilineFlag,
        line,
    } = params;

    if (multiline !== EMultiline.start) return [];
    if (multilineFlag === null) return [];

    const {
        Join,
        unknown,
        Percent, // Percent: TPos[]; // %
        comma, // comma: TPos[]; // ,
    } = multilineFlag;

    const diagList: CDiagBase[] = [
        // unknown
        ...unknown
            .map((Pos: TPos): CDiagBase => fnMakeDiag(Pos, EDiagCode.code120, line, vscode.DiagnosticSeverity.Warning)),
        //
        // Join is too long > 15 characters
        ...Join
            // eslint-disable-next-line no-magic-numbers
            .filter(({ len }: TPos): boolean => len > 19) // 15+ "join".len
            .map((Pos: TPos): CDiagBase => fnMakeDiag(Pos, EDiagCode.code121, line, vscode.DiagnosticSeverity.Warning)),
    ];

    if (Percent.length > 0) {
        diagList.push(fnMakeDiag(Percent[0], EDiagCode.code122, line, vscode.DiagnosticSeverity.Information));
    }
    if (comma.length > 0) {
        diagList.push(fnMakeDiag(comma[0], EDiagCode.code123, line, vscode.DiagnosticSeverity.Information));
    }

    return diagList;
}

export function getMultilineDiag(DocStrMap: TTokenStream): CDiagBase[] {
    return DocStrMap
        .filter(({ displayErr }: TAhkTokenLine): boolean => displayErr)
        .flatMap((params: TAhkTokenLine): CDiagBase[] => getMultilineDiagOfLine(params));
}

// https://www.autohotkey.com/docs/Scripts.htm#continuation-section
