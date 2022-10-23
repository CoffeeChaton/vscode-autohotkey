import * as vscode from 'vscode';
import { EDiagCode } from '../../../../diag';
import type { TAhkTokenLine } from '../../../../globalEnum';
import { CommandErrMap } from '../../../../tools/Built-in/Command_tools';
import { CDiagBase } from '../CDiagBase';

function getLoopErr(lStr: string, line: number, fistWordUpCol: number): CDiagBase | null {
    const matchLoop: RegExpMatchArray | null = lStr.match(/\bLoop\b\s*,?\s*(\w+)/iu);
    if (matchLoop === null) return null; // miss

    const SecondSection = matchLoop[1];
    if ((/^(?:\d+|Files|Parse|Read|Reg)$/ui).test(SecondSection)) {
        return null; // OK
    }

    // eslint-disable-next-line no-magic-numbers
    const colL = lStr.indexOf(SecondSection, fistWordUpCol + 4);
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

export function getCommandErr(params: TAhkTokenLine): CDiagBase | null {
    const {
        lStr,
        fistWordUp,
        fistWordUpCol,
        line,
    } = params;

    if (fistWordUp === '') return null; // miss
    if (fistWordUp === 'LOOP') {
        return getLoopErr(lStr, line, fistWordUpCol);
    }

    const diag: EDiagCode | undefined = CommandErrMap.get(fistWordUp);
    if (diag !== undefined) {
        const colL: number = fistWordUpCol;
        return new CDiagBase({
            value: diag,
            range: new vscode.Range(line, colL, line, colL + fistWordUp.length),
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [vscode.DiagnosticTag.Deprecated],
        });
    }
    // if (StatementMDMap.has(fistWordUp)) return null;
    // if (!CommandMDMap.has(fistWordUp)) {
    //     console.log('🚀 ~ getCommandErr ~ fistWordUp', fistWordUp);
    // }
    return null;
}
