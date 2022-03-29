import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { EDiagLine, TLineDiag } from './lineErrTools';

export function getLabelErr(lStr: string, lStrTrim: string, _fistWord: string): TLineDiag {
    if (lStrTrim.indexOf(':') < 1) return EDiagLine.miss;
    if (lStrTrim.indexOf('=') > -1) return EDiagLine.miss;

    // TODO ParserLine-> error
    // TODO Although there are no reserved names, it is strongly recommended that the following names not be used:
    // On, Off, Toggle, AltTab, ShiftAltTab, AltTabAndMenu and AltTabMenuDismiss.
    // These values have special meaning to the Hotkey command.
    // ^On|Off|Toggle|AltTab|ShiftAltTab|AltTabAndMenu|AltTabMenuDismiss$
    const match: RegExpMatchArray | null = lStrTrim.match(/^(\w+):[^=]/u);
    if (match === null) return EDiagLine.miss;

    const labName: string = match[1].toUpperCase();

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
