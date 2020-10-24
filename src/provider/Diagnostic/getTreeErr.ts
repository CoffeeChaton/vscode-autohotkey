import * as vscode from 'vscode';
import {
    EDiagBase, EDiagMsg, EDiagCode, MyDocSymbol,
} from '../../globalEnum';

function getDefaultNumber(swChildren: Readonly<MyDocSymbol[]>): number {
    let iDefault = 0;
    for (const caseOrDefault of swChildren) {
        if (caseOrDefault.name === 'Default :') iDefault += 1;
    }
    return iDefault;
}
function getCaseNumber(swChildren: Readonly<MyDocSymbol[]>): number {
    let iCase = 0;
    for (const caseOrDefault of swChildren) {
        if (caseOrDefault.name.startsWith('Case ')) iCase += 1;
    }
    return iCase;
}
function setErrDefaultNotFind(sw: MyDocSymbol): vscode.Diagnostic {
    const diag1 = new vscode.Diagnostic(sw.range, EDiagMsg.code110, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagBase.source;
    diag1.code = EDiagCode.code110;
    return diag1;
}
function setErrDefaultTooMuch(sw: MyDocSymbol): vscode.Diagnostic {
    const diag1 = new vscode.Diagnostic(sw.range, EDiagMsg.code111, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagBase.source;
    diag1.code = EDiagCode.code111;
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
function setErrCase(sw: MyDocSymbol): null | vscode.Diagnostic {
    const iCase = getCaseNumber(sw.children);
    // eslint-disable-next-line no-magic-numbers
    if (iCase < 20 && iCase > 0) return null;
    // eslint-disable-next-line no-magic-numbers
    if (iCase >= 20) {
        const caseTooMuch = new vscode.Diagnostic(sw.range, EDiagMsg.code112, vscode.DiagnosticSeverity.Information);
        caseTooMuch.source = EDiagBase.source;
        caseTooMuch.code = EDiagCode.code112;
        return caseTooMuch;
    }
    if (iCase < 1) {
        const caseZero = new vscode.Diagnostic(sw.range, EDiagMsg.code113, vscode.DiagnosticSeverity.Information);
        caseZero.source = EDiagBase.source;
        caseZero.code = EDiagCode.code113;
        return caseZero;
    }
    return null;
}

function getSwErr(sw: Readonly<MyDocSymbol>, displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    if (sw.kind === vscode.SymbolKind.Enum
        && displayErr[sw.range.start.line]
        && sw.detail === 'Switch') {
        const de = setErrDefault(sw);
        if (de) digS.push(de);
        const ce = setErrCase(sw);
        if (ce) digS.push(ce);
    }
    return digS;
}
export function getTreeErr(children: Readonly<MyDocSymbol[]>, displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const ch of children) {
        digS.push(...getSwErr(ch, displayErr));
        digS.push(...getTreeErr(ch.children, displayErr));
    }
    return digS;
}
