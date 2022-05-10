import * as vscode from 'vscode';
import { CAhkLabel } from '../../../../AhkSymbol/CAhkLine';
import { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import { setDiagnostic } from '../setDiagnostic';

export function getLabelErr(ch: TAhkSymbol): vscode.Diagnostic[] {
    if (!(ch instanceof CAhkLabel)) return [];

    const labName: string = ch.name.toUpperCase();

    type TLabelErr = {
        reg: RegExp;
        code: EDiagCode;
        tags: vscode.DiagnosticTag[];
    };
    const rulerMatch: TLabelErr[] = [
        {
            reg: /^DEFAULT:$/ui,
            code: EDiagCode.code501,
            tags: [],
        },
        {
            reg: /^OnClipboardChange:$/ui,
            code: EDiagCode.code811,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            reg: /^OnExit:$/ui,
            code: EDiagCode.code812,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // if ((/^On|Off|Toggle|ShiftAltTab|AltTab|AltTabAndMenu|AltTabMenuDismiss$/ui).test(labName)) {
            reg: /^(On|Off|Toggle|ShiftAltTab|AltTab(AndMenu|MenuDismiss)?):$/ui,
            code: EDiagCode.code502,
            tags: [],
        },
    ];

    for (const v of rulerMatch) {
        if (v.reg.test(labName)) {
            return [
                setDiagnostic(v.code, ch.selectionRange, vscode.DiagnosticSeverity.Warning, v.tags),
            ];
        }
    }

    return [];
}
