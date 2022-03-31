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
function getCommandErrFnReplace(fistWord: string, lStr: string): TLineDiag {
    // eslint-disable-next-line no-magic-numbers
    if (fistWord.length < 3) return EDiagLine.miss;
    // Command -> func https://www.autohotkey.com/docs/Language.htm#commands-vs-functions
    if (
        (/^(?:File(Append|GetAttrib|Read)|GetKeyState|If(?:Not)?(?:Exist|InString)|IfWin(?:Not)?(?:Active|Exist))$/ui)
            .test(fistWord)
        || (/^String(?:GetPos|Len|Replace|Split|Lower|Upper|Left|Mid|Right|TrimLeft|TrimRight)$/ui).test(fistWord)
    ) {
        const colL = lStr.search(/\S/u);
        return {
            colL,
            colR: colL + fistWord.length,
            value: EDiagCode.code700,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        };
    }
    return EDiagLine.miss;
}

// ---------------------------------------------------------------------------------------------------------------------
function getOtherCommandErr(fistWordUp: string, lStr: string): TLineDiag {
    // eslint-disable-next-line no-magic-numbers
    if (fistWordUp.length < 5) return EDiagLine.miss;
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
            reg: /^If(?:Equal|NotEqual|Less|LessOrEqual|Greater|GreaterOrEqual)$/ui,
            code: EDiagCode.code806,
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
            reg: /^Transform$/ui,
            code: EDiagCode.code824,
        },
        // Reg,,,... i need to Count colon  ??
    ];

    for (const v of headMatch) {
        if (v.reg.test(fistWordUp)) {
            const colL = lStr.search(/\S/ui);
            return {
                colL,
                colR: colL + fistWordUp.length,
                value: v.code,
                severity: vscode.DiagnosticSeverity.Warning,
                tags: [vscode.DiagnosticTag.Deprecated],
            };
        }
    }

    return EDiagLine.miss;
}

// ---------------------------------------------------------------------------------------------------------------------
export function getCommandErr(lStr: string, _lStrTrim: string, fistWordUp: string): TLineDiag {
    if (fistWordUp.length === 0) return EDiagLine.miss;

    if (fistWordUp === 'LOOP') {
        return getLoopErr(lStr);
    }

    if (
        [
            'SWITCH',
            'CASE',
            'DEFAULT',
            'IF',
            'WHILE',
            'ELSE',
            'RETURN',
            'BREAK',
            'FOR',
            'SLEEP',
            'STATIC',
            'GLOBAL',
            // SEND ?
            // FOR ?
            // MOUSEMOVE ?
            // don't add Loop
        ].indexOf(fistWordUp) > -1
    ) {
        return EDiagLine.miss;
    }

    // _commandHeadStatistics(fistWord);

    const fnReplaceErr: TLineDiag = getCommandErrFnReplace(fistWordUp, lStr);
    if (fnReplaceErr !== EDiagLine.miss) {
        return fnReplaceErr;
    }

    return getOtherCommandErr(fistWordUp, lStr);
}
