/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import { EDiagLine, TLineDiag } from './lineErrTools';

// ---------------------------------------------------------------------------------------------------------------------
function getLoopErr(lStr: string): TLineDiag {
    const exec = (/^\s*Loop\b[\s,]+(\w+)/iu).exec(lStr);
    if (exec === null) {
        return EDiagLine.miss;
    }
    const SecondSection = exec[1];
    if ((/^(?:\d+|Files|Parse|Read|Reg)$/ui).test(SecondSection)) {
        return EDiagLine.OK;
    }

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
// ---------------------------------------------------------------------------------------------------------------------
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
    return EDiagLine.miss;
}

// ---------------------------------------------------------------------------------------------------------------------
function getOtherCommandErr(commandHead: string, lStr: string): TLineDiag {
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
        // Reg,,,... i need to Count colon  ??
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

    return EDiagLine.miss;
}
// ---------------------------------------------------------------------------------------------------------------------
export function getCommandErr(lStr: string, lStrTrim: string): TLineDiag {
    const exec = (/^(\w+)[\s,]/u).exec(lStrTrim);
    if (exec === null) {
        return EDiagLine.miss;
    }
    const commandHead: string = exec[1];

    // high frequency words && is allowed
    // don't push gui commands in this line, because not high frequency.
    if ((/^(?:switch|case|if|while|else|return|Break|for|sleep|Static|global)$/ui).test(commandHead)) {
        return EDiagLine.miss;
    }
    //  _commandHeadStatistics()
    const fnReplaceErr: TLineDiag = getCommandErrFnReplace(commandHead, lStr);
    if (fnReplaceErr) {
        return fnReplaceErr;
    }
    if ((/^Loop$/ui).test(commandHead)) {
        return getLoopErr(lStr);
    }

    return getOtherCommandErr(commandHead, lStr);
}
