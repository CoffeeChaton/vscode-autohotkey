import * as vscode from 'vscode';
import { CAhkLabel } from '../../../../AhkSymbol/CAhkLine';
import { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import { setDiagnostic } from '../setDiagnostic';

export function getLabelErr(ch: TAhkSymbol, displayErr: readonly boolean[]): vscode.Diagnostic[] {
    if (!(ch instanceof CAhkLabel)) return [];
    if (!displayErr[ch.range.start.line]) return [];

    const labName: string = ch.name.toUpperCase();

    type TLabelErr = {
        str: string;
        code: EDiagCode;
        tags: vscode.DiagnosticTag[];
    };
    const rulerMatch: TLabelErr[] = [
        {
            str: 'DEFAULT:'.toUpperCase(),
            code: EDiagCode.code501,
            tags: [],
        },
        {
            str: 'OnClipboardChange:'.toUpperCase(),
            code: EDiagCode.code811,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            str: 'OnExit:'.toUpperCase(),
            code: EDiagCode.code812,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
    ];

    for (const v of rulerMatch) {
        if (v.str === labName) {
            return [
                setDiagnostic(v.code, ch.selectionRange, vscode.DiagnosticSeverity.Warning, v.tags),
            ];
        }
    }

    // if ((/^On|Off|Toggle|ShiftAltTab|AltTab|AltTabAndMenu|AltTabMenuDismiss$/ui).test(labName)) {
    if ((/^(On|Off|Toggle|ShiftAltTab|AltTab(AndMenu|MenuDismiss)?):$/ui).test(labName)) {
        return [
            setDiagnostic(EDiagCode.code502, ch.selectionRange, vscode.DiagnosticSeverity.Warning, []),
        ];
    }

    return [];
}
