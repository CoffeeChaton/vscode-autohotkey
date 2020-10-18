import * as vscode from 'vscode';
import { EDiagnostic, MyDocSymbol } from '../../globalEnum';

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
    const diag1 = new vscode.Diagnostic(sw.range, EDiagnostic.code110swNotFindDefault, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagnostic.Source;
    diag1.code = EDiagnostic.code110;
    return diag1;
}
function setErrDefaultTooMuch(sw: MyDocSymbol): vscode.Diagnostic {
    const diag1 = new vscode.Diagnostic(sw.range, EDiagnostic.code111swDefaultTooMuch, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagnostic.Source;
    diag1.code = EDiagnostic.code111;
    return diag1;
}

function setErrDefault(sw: MyDocSymbol, iDefault: number): null | vscode.Diagnostic {
    switch (iDefault) {
        case 0: return setErrDefaultNotFind(sw);
        case 1: return null;
        default: return setErrDefaultTooMuch(sw);
    }
}
function setErrCase(sw: MyDocSymbol, iCase: number): null | vscode.Diagnostic {
    // eslint-disable-next-line no-magic-numbers
    if (iCase < 20 && iCase > 0) return null;
    // eslint-disable-next-line no-magic-numbers
    if (iCase >= 20) {
        const caseTooMuch = new vscode.Diagnostic(sw.range, EDiagnostic.code112swCaseTooMuch, vscode.DiagnosticSeverity.Information);
        caseTooMuch.source = EDiagnostic.Source;
        caseTooMuch.code = EDiagnostic.code112;
        return caseTooMuch;
    }
    if (iCase < 1) {
        const caseZero = new vscode.Diagnostic(sw.range, EDiagnostic.code113swCaseIsZero, vscode.DiagnosticSeverity.Information);
        caseZero.source = EDiagnostic.Source;
        caseZero.code = EDiagnostic.code113;
        return caseZero;
    }
    return null;
}

export function getSwErr(children: Readonly<MyDocSymbol[]>): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const sw of children) {
        if (sw.kind === vscode.SymbolKind.Enum && sw.name.startsWith('Switch ')) {
            const dn = getDefaultNumber(sw.children);
            const de = setErrDefault(sw, dn);
            if (de) digS.push(de);

            const cn = getCaseNumber(sw.children);
            const ce = setErrCase(sw, cn);
            if (ce) digS.push(ce);
        } else {
            getSwErr(sw.children).forEach((e) => digS.push(e));
        }
    }
    return digS;
}
