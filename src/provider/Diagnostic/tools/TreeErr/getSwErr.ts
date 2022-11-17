/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,20] }] */
import * as vscode from 'vscode';
import { CAhkCase, CAhkDefault, CAhkSwitch } from '../../../../AhkSymbol/CAhkSwitch';
import type { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import { CDiagBase } from '../CDiagBase';

function setErrDefault(sw: CAhkSwitch): CDiagBase | null {
    const { children, range } = sw;
    const iDefault: number = children
        .filter((e: CAhkCase | CAhkDefault): boolean => e instanceof CAhkDefault)
        .length;

    if (iDefault === 1) return null; // OK

    return iDefault === 0
        ? new CDiagBase({ // not find
            value: EDiagCode.code111,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        })
        : new CDiagBase({ // too Much
            value: EDiagCode.code111,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        });
}

function setErrCase(sw: CAhkSwitch): CDiagBase | null {
    const { children, range } = sw;
    const iCase: number = children
        .filter((e: CAhkCase | CAhkDefault): boolean => e instanceof CAhkCase)
        .length;

    // too Much
    if (iCase > 20) {
        return new CDiagBase({
            value: EDiagCode.code112,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        });
    }

    return iCase === 0 // not find
        ? new CDiagBase({
            value: EDiagCode.code113,
            range,
            severity: vscode.DiagnosticSeverity.Warning,
            tags: [],
        })
        : null; // at 1~19
}

function setErrSwNameNotFind(sw: CAhkSwitch): CDiagBase | null {
    const { name, range } = sw;
    // i know ahk allow switch name is not found, but I don't think it is a good idea.
    return name === ''
        ? new CDiagBase({
            value: EDiagCode.code114,
            range,
            severity: vscode.DiagnosticSeverity.Information,
            tags: [],
        })
        : null;
}

export function getSwErr(sw: TAhkSymbol): CDiagBase[] {
    if (!(sw instanceof CAhkSwitch)) return [];

    type TFnLint = (sw: CAhkSwitch) => CDiagBase | null;
    const fnList: TFnLint[] = [setErrDefault, setErrCase, setErrSwNameNotFind];

    const digS: CDiagBase[] = [];
    for (const fn of fnList) {
        const err: CDiagBase | null = fn(sw);
        if (err !== null) digS.push(err);
    }

    return digS;
}
