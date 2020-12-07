/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,20] }] */
import * as vscode from 'vscode';
import {
    EDiagBase, EDiagMsg, EDiagCode, MyDocSymbol, EDiagFsPath,
} from '../../globalEnum';

function getDefaultNumber(swChildren: Readonly<MyDocSymbol[]>): number {
    return swChildren.reduce((iDefault, element): number => (element.name === 'Default :' ? iDefault + 1 : iDefault), 0);
}
function getCaseNumber(swChildren: Readonly<MyDocSymbol[]>): number {
    return swChildren.reduce((iCase, element): number => (element.name.startsWith('Case ') ? iCase + 1 : iCase), 0);
}
function setErrDefaultNotFind(sw: MyDocSymbol): vscode.Diagnostic {
    const diag1 = new vscode.Diagnostic(sw.range, EDiagMsg.code110, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagBase.source;
    diag1.code = {
        value: EDiagCode.code110,
        target: vscode.Uri.parse(EDiagFsPath.code110),
    };
    return diag1;
}
function setErrDefaultTooMuch(sw: MyDocSymbol): vscode.Diagnostic {
    const diag1 = new vscode.Diagnostic(sw.range, EDiagMsg.code111, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagBase.source;
    diag1.code = {
        value: EDiagCode.code111,
        target: vscode.Uri.parse(EDiagFsPath.code111),
    };
    return diag1;
}

function setErrDefault(sw: MyDocSymbol): null | vscode.Diagnostic {
    const iDefault = getDefaultNumber(sw.children);
    switch (iDefault) {
        case 0: return setErrDefaultNotFind(sw);
        case 1: return null;
        default: return setErrDefaultTooMuch(sw);
    }
}
function setCaseTooMuch(sw: MyDocSymbol): vscode.Diagnostic {
    const caseTooMuch = new vscode.Diagnostic(sw.range, EDiagMsg.code112, vscode.DiagnosticSeverity.Information);
    caseTooMuch.source = EDiagBase.source;
    caseTooMuch.code = {
        value: EDiagCode.code112,
        target: vscode.Uri.parse(EDiagFsPath.code112),
    };
    return caseTooMuch;
}
function setErrCaseZero(sw: MyDocSymbol): vscode.Diagnostic {
    const caseZero = new vscode.Diagnostic(sw.range, EDiagMsg.code113, vscode.DiagnosticSeverity.Information);
    caseZero.source = EDiagBase.source;
    caseZero.code = {
        value: EDiagCode.code113,
        target: vscode.Uri.parse(EDiagFsPath.code113),
    };
    return caseZero;
}

function setErrCase(sw: MyDocSymbol): null | vscode.Diagnostic {
    // TODO Duplicate case label.
    const iCase = getCaseNumber(sw.children);
    switch (true) {
        case iCase < 20 && iCase > 0: return null;
        case iCase >= 20: return setCaseTooMuch(sw);
        case iCase < 1: return setErrCaseZero(sw);
        default: return null;
    }
}
function setErrSwNameNotFind(sw: MyDocSymbol): null | vscode.Diagnostic {
    if (sw.name.startsWith('!!') === false) return null;
    const swNameNotFind = new vscode.Diagnostic(sw.range, EDiagMsg.code114, vscode.DiagnosticSeverity.Error);
    swNameNotFind.source = EDiagBase.source;
    swNameNotFind.code = {
        value: EDiagCode.code114,
        target: vscode.Uri.parse(EDiagFsPath.code114),
    };
    return swNameNotFind;
}
function getSwErr(sw: MyDocSymbol, displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    if (sw.kind === vscode.SymbolKind.Enum
        && displayErr[sw.range.start.line]
        && sw.detail === 'Switch') {
        [setErrDefault, setErrCase, setErrSwNameNotFind].forEach((fn) => {
            const err = fn(sw);
            if (err) digS.push(err);
        });
    }
    return digS;
}

export function getTreeErr(children: readonly MyDocSymbol[], displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    children.forEach((ch) => {
        digS.push(...getSwErr(ch, displayErr), ...getTreeErr(ch.children, displayErr));
    });
    return digS;
}
