import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { EDiagLine, TLineDiag } from './lineErrTools';

export function getDirectivesErr(lStr: string, lStrTrim: string, _fistWordUp: string): TLineDiag {
    // err of #Directives

    if (!lStrTrim.startsWith('#')) return EDiagLine.miss; // 30ms -> 5ms
    const match: RegExpMatchArray | null = lStrTrim.match(/^#(\w+)/u);
    if (match === null) return EDiagLine.miss;

    const Directives: string = match[1];
    const colL: number = lStr.indexOf('#') + 1;
    const colR: number = colL + Directives.length;
    const severity = vscode.DiagnosticSeverity.Error;

    // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
    if ((/^EscapeChar$/ui).test(Directives)) {
        return {
            colL,
            colR,
            value: EDiagCode.code901,
            severity,
            tags: [],
        };
    }

    // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
    if ((/^CommentFlag$/ui).test(Directives)) {
        return {
            colL,
            colR,
            value: EDiagCode.code902,
            severity,
            tags: [],
        };
    }

    // change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
    if ((/^(?:DerefChar|Delimiter)$/ui).test(Directives)) {
        return {
            colL,
            colR,
            value: EDiagCode.code903,
            severity,
            tags: [],
        };
    }

    // TODO: check user #NotAhkDirectives
    return EDiagLine.OK;
}
