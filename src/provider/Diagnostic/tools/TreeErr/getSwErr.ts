/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,20] }] */
import * as vscode from 'vscode';
import { CAhkCase, CAhkDefault, CAhkSwitch } from '../../../../AhkSymbol/CAhkSwitch';
import type { TAhkSymbol } from '../../../../AhkSymbol/TAhkSymbolIn';
import { EDiagCode } from '../../../../diag';
import { setDiagnostic } from '../setDiagnostic';

function setErrDefault(sw: CAhkSwitch): vscode.Diagnostic | null {
    const iDefault: number = sw.children
        .filter((e: CAhkCase | CAhkDefault): boolean => e instanceof CAhkDefault)
        .length;

    if (iDefault === 1) return null; // OK

    return iDefault === 0
        ? setDiagnostic(EDiagCode.code110, sw.range, vscode.DiagnosticSeverity.Warning, []) // not find
        : setDiagnostic(EDiagCode.code111, sw.range, vscode.DiagnosticSeverity.Warning, []); // too Much
}

function setErrCase(sw: CAhkSwitch): vscode.Diagnostic | null {
    const iCase: number = sw.children
        .filter((e: CAhkCase | CAhkDefault): boolean => e instanceof CAhkCase)
        .length;

    // too Much
    if (iCase > 20) return setDiagnostic(EDiagCode.code112, sw.range, vscode.DiagnosticSeverity.Warning, []);

    return iCase === 0 // not find
        ? setDiagnostic(EDiagCode.code113, sw.range, vscode.DiagnosticSeverity.Warning, [])
        : null; // at 1~19
}

function setErrSwNameNotFind(sw: CAhkSwitch): vscode.Diagnostic | null {
    // i know ahk allow switch name is not found, but I don't think it is a good idea.
    return sw.name === ''
        ? setDiagnostic(EDiagCode.code114, sw.range, vscode.DiagnosticSeverity.Information, [])
        : null;
}

export function getSwErr(sw: TAhkSymbol): vscode.Diagnostic[] {
    if (!(sw instanceof CAhkSwitch)) return [];

    type TFnLint = (sw: CAhkSwitch) => vscode.Diagnostic | null;
    const fnList: TFnLint[] = [setErrDefault, setErrCase, setErrSwNameNotFind];

    const digS: vscode.Diagnostic[] = [];
    for (const fn of fnList) {
        const err: vscode.Diagnostic | null = fn(sw);
        if (err !== null) digS.push(err);
    }

    return digS;
}
