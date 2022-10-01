import * as vscode from 'vscode';
import { CAhkLabel } from '../../../../AhkSymbol/CAhkLine';
import type { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import { CDiagBase } from '../CDiagBase';

export function getLabelErr(ch: TAhkSymbol): CDiagBase[] {
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
            // if ((/^On|Off|Toggle|ShiftAltTab|AltTab|AltTabAndMenu|AltTabMenuDismiss$/ui).test(labName)) {
            reg: /^(On|Off|Toggle|ShiftAltTab|AltTab(AndMenu|MenuDismiss)?):$/ui,
            code: EDiagCode.code502,
            tags: [],
        },
    ];

    const v2: TLabelErr | undefined = rulerMatch.find((v) => v.reg.test(labName));
    return (v2 !== undefined)
        ? [
            new CDiagBase({
                value: v2.code,
                range: ch.selectionRange,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: v2.tags,
            }),
        ]
        : [];
}
