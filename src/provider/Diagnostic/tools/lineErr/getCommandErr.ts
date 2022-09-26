import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { CommandErrMap } from '../../../../tools/Built-in/Command_Tools';
import { StatementMDMap } from '../../../../tools/Built-in/statement_vsc';
import { CDiagBase } from '../CDiagBase';

function getLoopErr(lStr: string, line: number): CDiagBase | null {
    const matchLoop: RegExpMatchArray | null = lStr.match(/^\s*Loop\b[\s,]+(\w+)/iu);
    if (matchLoop === null) return null; // miss

    const SecondSection = matchLoop[1];
    if ((/^(?:\d+|Files|Parse|Read|Reg)$/ui).test(SecondSection)) {
        return null; // OK
    }

    // eslint-disable-next-line no-magic-numbers
    const position = lStr.search(/\bloop\b/iu) + 4;
    const colL = lStr.indexOf(SecondSection, position);
    const colR = colL + SecondSection.length;
    if ((/^RootKey$/ui).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopReg.htm#old
        return new CDiagBase({
            value: EDiagCode.code801,
            range: new vscode.Range(line, colL, line, colR),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }

    if ((/^FilePattern$/ui).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopFile.htm#old
        return new CDiagBase({
            value: EDiagCode.code802,
            range: new vscode.Range(line, colL, line, colR),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }

    // https://www.autohotkey.com/docs/commands/Loop.htm
    return new CDiagBase({
        value: EDiagCode.code201,
        range: new vscode.Range(line, colL, line, colR),
        severity: vscode.DiagnosticSeverity.Error,
        tags: [],
    });
}

function getCommandErrFnReplace(fistWordUp: string, lStr: string, line: number): CDiagBase {
    // // Command -> func https://www.autohotkey.com/docs/Language.htm#commands-vs-functions
    const colL: number = lStr.search(/\S/u);
    return new CDiagBase({
        value: EDiagCode.code700,
        range: new vscode.Range(line, colL, line, colL + fistWordUp.length),
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [vscode.DiagnosticTag.Deprecated],
    });
}

function getOtherCommandErr(fistWordUp: string, lStr: string, line: number): CDiagBase | null {
    // eslint-disable-next-line no-magic-numbers
    if (fistWordUp.length < 5) return null; // miss
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
            code: EDiagCode.code806, // FIXME
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
        // New: RegRead, OutputVar, KeyName , ValueName
        // Old: RegRead, OutputVar, RootKey, SubKey , ValueName
    ];

    const find: TCommandErr | undefined = headMatch.find((v) => v.reg.test(fistWordUp));
    if (find === undefined) return null; // miss

    const colL: number = lStr.search(/\S/ui);

    return new CDiagBase({
        value: find.code,
        range: new vscode.Range(line, colL, line, colL + fistWordUp.length),
        severity: vscode.DiagnosticSeverity.Warning,
        tags: [vscode.DiagnosticTag.Deprecated],
    });
}

export function getCommandErr(params: TAhkTokenLine): CDiagBase | null {
    const {
        lStr,
        fistWordUp,
        line,
    } = params;

    if (fistWordUp === '') return null; // miss
    if (StatementMDMap.has(fistWordUp)) return null;

    if (fistWordUp === 'LOOP') {
        return getLoopErr(lStr, line);
    }

    const diag: EDiagCode | undefined = CommandErrMap.get(fistWordUp);
    if (diag === EDiagCode.code700) return getCommandErrFnReplace(fistWordUp, lStr, line);

    const OtherCommandErr: CDiagBase | null = getOtherCommandErr(fistWordUp, lStr, line);
    if (OtherCommandErr !== null) return OtherCommandErr;

    // if (!CommandMDMap.has(fistWordUp)) {
    //     console.log('🚀 ~ Pretreatment ~ fistWordUp', fistWordUp);
    // }

    return null;
}

// FIXME use hashMap replace this .ts
