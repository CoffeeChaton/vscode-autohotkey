import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { EDiagLine, TLineDiag } from './lineErrTools';

export function getDirectivesErr(lStr: string, lStrTrim: string, _fistWord: string): TLineDiag {
    // err of #Directives
    const exec = (/^#(\w+)/u).exec(lStrTrim);
    if (exec === null) return EDiagLine.miss;

    const Directives = exec[1];
    const colL = lStr.indexOf(Directives);
    const colR = colL + Directives.length;
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
