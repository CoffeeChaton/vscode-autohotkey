/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import { TTokenStream } from '../../../globalEnum';
import { assignErr } from './lineErr/assignErr';
import { EDiagLine, TLineDiag, TLineErr } from './lineErr/lineErrTools';
import { setDiagnostic } from './setDiagnostic';

function getLoopErr(lStr: string): TLineDiag {
    const exec = (/^\s*Loop\b[\s,]+(\w+)/iu).exec(lStr);
    if (exec === null) return 0;
    const SecondSection = exec[1];
    if ((/^(?:\d+|Files|Parse|Read|Reg)$/ui).test(SecondSection)) return 1;

    // eslint-disable-next-line no-magic-numbers
    const position = Math.max(0, lStr.search(/\bloop\b/iu)) + 4;
    const colL = Math.max(0, lStr.indexOf(SecondSection, position));
    const colR = colL + SecondSection.length;
    if ((/^RootKey$/ui).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopReg.htm#old
        return {
            colL,
            colR,
            value: EDiagCode.code801,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        };
    }

    if ((/^FilePattern$/ui).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopFile.htm#old
        return {
            colL,
            colR,
            value: EDiagCode.code802,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        };
    }

    // https://www.autohotkey.com/docs/commands/Loop.htm
    return {
        colL,
        colR,
        value: EDiagCode.code201,
        severity: vscode.DiagnosticSeverity.Error,
        tags: [],
    };
}

function getDirectivesErr(lStr: string): TLineDiag {
    // err of #Directives
    if (lStr.indexOf('#') === -1) return 0;
    if (!(/^\s*#/ui).test(lStr)) return 0;

    const exec = (/^\s*#(\w+)/u).exec(lStr);
    if (exec === null) return 0;
    const Directives = exec[1];
    const colL = Math.max(0, lStr.indexOf(Directives));
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

    return 1;
}

function getCommandErrFnReplace(commandHead: string, lStr: string): TLineDiag {
    // Command -> func https://www.autohotkey.com/docs/Language.htm#commands-vs-functions
    if (
        (/^(?:File(Append|GetAttrib|Read)|GetKeyState|IfExist|IfInString|IfWin(?:Not)?(?:Active|Exist))$/ui).test(
            commandHead,
        )
        || (/^String(?:GetPos|Len|Replace|Split|Lower|Upper|Left|Mid|Right|TrimLeft|TrimRight)$/ui).test(commandHead)
    ) {
        const colL = lStr.indexOf(commandHead);
        return {
            colL,
            colR: colL + commandHead.length,
            value: EDiagCode.code700,
            severity: vscode.DiagnosticSeverity.Information,
            tags: [vscode.DiagnosticTag.Deprecated],
        };
    }
    return 0;
}

function getCommandErr(lStr: string): TLineDiag {
    if (!(/^\s*\w+[\s,]/u).test(lStr)) return 0;

    const exec = (/^\s*(\w+)[\s,]/u).exec(lStr);
    if (exec === null) return 0;
    const commandHead: string = exec[1];
    if ((/^(?:switch|case|if|while|else|return|Break|for|sleep)$/ui).test(commandHead)) return 1;

    const fnReplaceErr: TLineDiag = getCommandErrFnReplace(commandHead, lStr);
    if (fnReplaceErr) return fnReplaceErr;
    if ((/^Loop$/ui).test(commandHead)) return getLoopErr(lStr);

    type TCommandErr = {
        reg: RegExp;
        code: EDiagCode;
    };
    const headMatch: TCommandErr[] = [
        {
            reg: /^EnvDiv$/ui,
            code: EDiagCode.code803,
        },
        {
            reg: /^EnvMult$/ui,
            code: EDiagCode.code804,
        },
        {
            reg: /^GetKeyState$/ui,
            code: EDiagCode.code805,
        },
        {
            reg: /^If(?:Equal|NotEqual|Less|LessOrEqual|Greater|GreaterOrEqual)$/ui,
            code: EDiagCode.code806,
        },
        {
            reg: /^If(?:Exist|NotExist)$/ui,
            code: EDiagCode.code807,
        },
        {
            reg: /^If(?:Not)?InString$/ui,
            code: EDiagCode.code808,
        },
        {
            reg: /^IfWin(?:Not)?Active$/ui,
            code: EDiagCode.code809,
        },
        {
            reg: /^IfWin(?:Not)?Exist$/ui,
            code: EDiagCode.code810,
        },
        {
            reg: /^SplashImage|Progress$/ui,
            code: EDiagCode.code813,
        },
        {
            reg: /^SetEnv$/ui,
            code: EDiagCode.code814,
        },
        {
            reg: /^SetFormat$/ui,
            code: EDiagCode.code815,
        },
        {
            reg: /^SplashText(?:On|Off)$/ui,
            code: EDiagCode.code816,
        },
        {
            reg: /^StringGetPos$/ui,
            code: EDiagCode.code817,
        },
        {
            reg: /^String(?:Left|Right)/ui,
            code: EDiagCode.code818,
        },
        {
            reg: /^StringLen/ui,
            code: EDiagCode.code819,
        },
        {
            reg: /^StringMid$/ui,
            code: EDiagCode.code820,
        },
        {
            reg: /^StringReplace$/ui,
            code: EDiagCode.code821,
        },
        {
            reg: /^StringSplit$/ui,
            code: EDiagCode.code822,
        },
        {
            reg: /^StringTrim(?:Left|Right)$/ui,
            code: EDiagCode.code823,
        },
        {
            reg: /^Transform$/ui,
            code: EDiagCode.code824,
        },
    ];

    for (const v of headMatch) {
        if (v.reg.test(commandHead)) {
            const colL = lStr.search(commandHead);
            return {
                colL,
                colR: colL + commandHead.length,
                value: v.code,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [vscode.DiagnosticTag.Deprecated],
            };
        }
    }
    // Reg,,,... i need to Count colon  ??
    return 1;
}

function getLabelErr(lStr: string): TLineDiag {
    if (lStr.indexOf(':') < 1) return 0;
    const exec = (/^\s*(\w+)\s*:/u).exec(lStr);
    if (exec === null) return 0;
    const labName = exec[1];
    type TLabelErr = {
        reg: RegExp;
        code: EDiagCode;
    };
    const headMatch: TLabelErr[] = [
        {
            reg: /^OnClipboardChange$/ui,
            code: EDiagCode.code811,
        },
        {
            reg: /^OnExit$/ui,
            code: EDiagCode.code812,
        },
    ];
    for (const v of headMatch) {
        if (v.reg.test(labName)) {
            const colL = lStr.search(labName);
            return {
                colL,
                colR: colL + labName.length,
                value: v.code,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [vscode.DiagnosticTag.Deprecated],
            };
        }
    }

    return 1;
}

function lineErrDiag(line: number, lineErr: TLineErr): vscode.Diagnostic {
    const {
        colL,
        colR,
        value,
        severity,
        tags,
    } = lineErr;
    const range = new vscode.Range(line, colL, line, colR);
    return setDiagnostic(value, range, severity, tags);
}

function getLineErrCore(lStr: string): 0 | TLineErr {
    if (lStr.trim() === '') return 0;
    type TFnLineErr = (lStr: string) => TLineDiag;
    const fnList: TFnLineErr[] = [getDirectivesErr, getCommandErr, getLabelErr];
    for (const fn of fnList) {
        const err: TLineDiag = fn(lStr);

        if (err === EDiagLine.OK) return 0; // OK

        if (err !== EDiagLine.miss) { // err
            return err;
        }
        // err=== EDiagLine.miss
    }
    return 0;
}

// ----------------------------------------------------------------

export function getLineErr(DocStrMap: TTokenStream, line: number): null | vscode.Diagnostic {
    const { textRaw, lStr, detail } = DocStrMap[line];
    const err0: TLineDiag = assignErr(textRaw, detail);
    if (err0 && err0 !== EDiagLine.OK) {
        return lineErrDiag(line, err0);
    }

    const err1: TLineErr | 0 = getLineErrCore(lStr);

    if (err1) return lineErrDiag(line, err1);
    // err1 === 0
    return null;
}
