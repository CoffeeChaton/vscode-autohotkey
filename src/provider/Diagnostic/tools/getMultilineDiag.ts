import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import type {
    TAhkTokenLine,
    TMultilineFlag,
    TPos,
    TTokenStream,
} from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';
import { CDiagBase } from './CDiagBase';

const fnMakeDiag = (Pos: TPos, value: EDiagCode, line: number): CDiagBase => {
    //
    const { col, len } = Pos;
    return new CDiagBase({ // diag if len > 15 // https://www.autohotkey.com/docs/Scripts.htm#Join
        value,
        range: new vscode.Range(line, col, line, col + len),
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    });
};

function MultilineDiagJoin(multilineFlag: NonNullable<TMultilineFlag>, line: number): CDiagBase[] {
    return multilineFlag
        .Join
        // eslint-disable-next-line no-magic-numbers
        .filter(({ len }: TPos): boolean => len > 15)
        .map((Pos: TPos): CDiagBase => fnMakeDiag(Pos, EDiagCode.code121, line));
}

function MultilineDiagUnknown(multilineFlag: NonNullable<TMultilineFlag>, line: number): CDiagBase[] {
    return multilineFlag
        .unknown
        .map((Pos: TPos): CDiagBase => fnMakeDiag(Pos, EDiagCode.code120, line));
}

function getMultilineDiagOfLine(params: TAhkTokenLine): CDiagBase[] {
    const {
        multiline,
        multilineFlag,
        line,
    } = params;

    if (multiline !== EMultiline.start) return [];
    if (multilineFlag === null) return [];

    return [
        ...MultilineDiagJoin(multilineFlag, line),
        ...MultilineDiagUnknown(multilineFlag, line),
    ];
}

export function getMultilineDiag(DocStrMap: TTokenStream): CDiagBase[] {
    return DocStrMap
        .filter(({ displayErr }: TAhkTokenLine): boolean => displayErr)
        .flatMap((params: TAhkTokenLine): CDiagBase[] => getMultilineDiagOfLine(params));
}

// https://www.autohotkey.com/docs/Scripts.htm#continuation-section
