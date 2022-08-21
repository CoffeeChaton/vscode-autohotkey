import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import type { TAhkTokenLine } from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';
import { CDiagBase } from './CDiagBase';

function getMultilineDiag(params: TAhkTokenLine): CDiagBase | null {
    const {
        multiline,
        multilineFlag,
        line,
        textRaw,
    } = params;

    if (multilineFlag === null) return null;
    if (multiline !== EMultiline.start) return null;

    // {
    //     Join: boolean; // diag if len > 15
    //     LTrim: boolean; // if false, suggest join()
    //     RTrim0: boolean; // if true, suggest join()
    //     Comments: boolean; // show not support now
    //     '%': boolean; // show not support now
    //     ',': boolean; // show not support now
    //     '`': boolean; // show not support now
    //     unknown: boolean; // show not'support
    // }

    const colL = textRaw.indexOf('(');
    return new CDiagBase({
        value: EDiagCode.code601, // FIXME getMultilineDiag
        range: new vscode.Range(line, colL, line, textRaw.length),
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [],
    });
}
// https://www.autohotkey.com/docs/Scripts.htm#continuation
