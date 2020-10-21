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

export function getSwErr(children: Readonly<MyDocSymbol[]>, showErr: boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const sw of children) {
        if (sw.kind === vscode.SymbolKind.Enum
            && showErr[sw.range.start.line]
            && sw.name.startsWith('Switch ')) {
            const dn = getDefaultNumber(sw.children);
            const de = setErrDefault(sw, dn);
            if (de) digS.push(de);

            const cn = getCaseNumber(sw.children);
            const ce = setErrCase(sw, cn);
            if (ce) digS.push(ce);
        } else {
            getSwErr(sw.children, showErr).forEach((e) => digS.push(e));
        }
    }
    return digS;
}
