/* cSpell:disable */
import * as vscode from 'vscode';
import { CAhkDirectives } from '../../../../AhkSymbol/CAhkLine';
import { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import { DirectivesList } from '../../../../Enum/EDirectives';
import { setDiagnostic } from '../setDiagnostic';

export function getDirectivesErr(ch: TAhkSymbol): vscode.Diagnostic[] {
    // err of #Directives
    if (!(ch instanceof CAhkDirectives)) return [];

    type TElement = typeof DirectivesList[number];

    type TRulerErr = {
        str: TElement;
        code: EDiagCode;
        severity: vscode.DiagnosticSeverity;
        tags: vscode.DiagnosticTag[];
    };

    const rulerMatch: TRulerErr[] = [
        {
            // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
            str: 'ESCAPECHAR',
            code: EDiagCode.code901,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
            str: 'COMMENTFLAG',
            code: EDiagCode.code902,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
            // #DerefChar
            str: 'DEREFCHAR',
            code: EDiagCode.code903,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
            // #Delimiter
            str: 'DELIMITER',
            code: EDiagCode.code903,
            severity: vscode.DiagnosticSeverity.Error,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // https://www.autohotkey.com/docs/commands/_AllowSameLineComments.htm
            str: 'ALLOWSAMELINECOMMENTS',
            code: EDiagCode.code825,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        },
        {
            // https://www.autohotkey.com/docs/commands/_Hotstring.htm
            // #Hotstring
            str: 'HOTSTRING',
            code: EDiagCode.code904,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        },
    ];

    const { hashtag } = ch;
    for (const v of rulerMatch) {
        if (v.str === hashtag) {
            return [
                setDiagnostic(v.code, ch.selectionRange, v.severity, v.tags),
            ];
        }
    }

    // check is unknown Directives or not
    return DirectivesList.indexOf(hashtag as TElement) > -1
        ? []
        : [setDiagnostic(EDiagCode.code503, ch.selectionRange, vscode.DiagnosticSeverity.Warning, [])];
}
