/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,20] }] */
import * as vscode from 'vscode';
import { EDiagCode } from '../../../diag';
import { TAhkSymbol } from '../../../globalEnum';
import { setDiagnostic } from './setDiagnostic';

function getDefaultNumber(swChildren: Readonly<TAhkSymbol[]>): number {
    let iDefault = 0;
    swChildren.forEach((e) => {
        if (e.name === 'Default :') iDefault++;
    });
    return iDefault;
}
function getCaseNumber(swCh: Readonly<TAhkSymbol[]>): number {
    let iCase = 0;
    swCh.forEach((e) => {
        if (e.name.startsWith('Case ')) iCase++;
    });
    return iCase;
}
function setErrDefaultNotFind(sw: TAhkSymbol): vscode.Diagnostic {
    const value = EDiagCode.code110;
    const range = sw.selectionRange;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Information, []);
}
function setErrDefaultTooMuch(sw: TAhkSymbol): vscode.Diagnostic {
    const value = EDiagCode.code111;
    const { range } = sw;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Information, []);
}

function setErrDefault(sw: TAhkSymbol): null | vscode.Diagnostic {
    const iDefault = getDefaultNumber(sw.children);
    // dprint-ignore
    switch (iDefault) {
        case 0: return setErrDefaultNotFind(sw);
        case 1: return null;
        default: return setErrDefaultTooMuch(sw);
    }
}
function setCaseTooMuch(sw: TAhkSymbol): vscode.Diagnostic {
    const value = EDiagCode.code112;
    const { range } = sw;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Information, []);
}
function setErrCaseZero(sw: TAhkSymbol): vscode.Diagnostic {
    const value = EDiagCode.code113;
    const { range } = sw;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Information, []);
}

function setErrCase(sw: TAhkSymbol): null | vscode.Diagnostic {
    const iCase = getCaseNumber(sw.children);
    // dprint-ignore
    switch (true) {
        case iCase < 20 && iCase > 0: return null;
        case iCase >= 20: return setCaseTooMuch(sw);
        case iCase < 1: return setErrCaseZero(sw);
        default: return null;
    }
}
function setErrSwNameNotFind(sw: TAhkSymbol): null | vscode.Diagnostic {
    if (!sw.name.startsWith('!!')) return null;
    const value = EDiagCode.code114;
    const { range } = sw;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Error, []);
}
function getSwErr(sw: TAhkSymbol, displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    if (
        sw.kind === vscode.SymbolKind.Enum
        && displayErr[sw.range.start.line]
        && sw.detail === 'Switch'
    ) {
        [setErrDefault, setErrCase, setErrSwNameNotFind].forEach((fn) => {
            const err: vscode.Diagnostic | null = fn(sw);
            if (err !== null) digS.push(err);
        });
    }
    return digS;
}

export function getTreeErr(children: readonly TAhkSymbol[], displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    children.forEach((ch) => {
        digS.push(...getSwErr(ch, displayErr), ...getTreeErr(ch.children, displayErr));
    });
    return digS;
}
