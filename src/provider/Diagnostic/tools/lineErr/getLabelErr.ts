import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { EDiagLine, TLineDiag } from './lineErrTools';

export function getLabelErr(lStr: string, lStrTrim: string, _fistWordUp: string): TLineDiag {
    if (!lStrTrim.endsWith(':')) return EDiagLine.miss; // 30~40ms -> 9~15ms
    if (lStrTrim.startsWith(':')) return EDiagLine.miss;

    const match: RegExpMatchArray | null = lStrTrim.match(/^(\w+):$/u);
    if (match === null) return EDiagLine.miss;

    const labName: string = match[1].toUpperCase();
    if (labName === 'DEFAULT') return EDiagLine.miss;

    type TLabelErr = {
        str: string;
        code: EDiagCode;
    };
    const headMatch: TLabelErr[] = [
        {
            str: 'OnClipboardChange'.toUpperCase(),
            code: EDiagCode.code811,
        },
        {
            str: 'OnExit'.toUpperCase(),
            code: EDiagCode.code812,
        },
        // TODO uer AST replace
        // strongly recommended that the following names not be used
        // TODO ^On|Off|Toggle|AltTab|ShiftAltTab|AltTabAndMenu|AltTabMenuDismiss$
        // https://www.autohotkey.com/docs/misc/Labels.htm#syntax-and-usage
    ];

    for (const v of headMatch) {
        if (v.str === labName) {
            const colL: number = lStr.search(/\S/u);
            return {
                colL,
                colR: colL + labName.length,
                value: v.code,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [vscode.DiagnosticTag.Deprecated],
            };
        }
    }
    return EDiagLine.OK;
}
