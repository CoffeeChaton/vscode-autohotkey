/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import {
    TDocArr, EDiagBase, EDiagCode, EDiagMsg, MyDocSymbol, DetailType,
} from '../../globalEnum';
import { getTreeErr } from './getTreeErr';

function getIgnore(DocStrMap: TDocArr, line: number, IgnoreLine: number): number {
    // ;@ahk-ignore 30 line.
    // textRaw
    if (DocStrMap[line].textRaw.indexOf(EDiagBase.ignore) === -1) return IgnoreLine;
    const ignoreExec = (/^\s*;@ahk-ignore\s\s*(\d\d*)\s/i).exec(DocStrMap[line].textRaw);
    if (ignoreExec === null) {
        console.log('function getIgnore -> ignoreExec', ignoreExec);
        console.log(line, ' line');
        return IgnoreLine;
    }
    const numberOfIgnore = Number(ignoreExec[1]);
    if (Number.isNaN(numberOfIgnore)) {
        vscode.window.showInformationMessage(`Parsing error of ${line} line about ;@ahk-ignore (number) line.`);
        return -1;
    }
    return numberOfIgnore + line;
}

function assign(DocStrMap: TDocArr, line: number, uri: vscode.Uri): null | vscode.Diagnostic {
    // https://www.autohotkey.com/docs/commands/SetEnv.htm
    if (!DocStrMap[line].detail.includes(DetailType.inSkipSign2)) return null;

    let col = DocStrMap[line].textRaw.indexOf('=');
    if (col === -1) col = 0;
    const Range = new vscode.Range(line, col, line, DocStrMap[line].textRaw.length);

    const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code107, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagBase.source;
    diag1.code = EDiagCode.code107;
    //   diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(uri, pos), 'suggest to use := not =')];
    return diag1;
}
function getLoopErr(DocStrMap: TDocArr, line: number, uri: vscode.Uri): null | vscode.Diagnostic {
    if ((/^\s*Loop\b/i).test(DocStrMap[line].lStr) === false) return null; // not loop
    // eslint-disable-next-line prefer-destructuring
    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*Loop\b[\s,][\s,]*(\w\w*)/i).exec(lStr);
    if (exec === null) return null;
    const SecondSection = exec[1];
    if ((/^\d\d*$/).test(SecondSection)) return null;
    if ((/^(?:Files|Parse|Read|Reg)$/i).test(SecondSection)) return null;
    const col = Math.max(0, lStr.indexOf(SecondSection));
    const Range = new vscode.Range(line, col, line, col + SecondSection.length);
    if ((/^RootKey$/i).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopReg.htm#old
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code801, vscode.DiagnosticSeverity.Warning);
        diag1.source = EDiagBase.source;
        diag1.code = EDiagCode.code801;
        return diag1;
    }
    if ((/^FilePattern$/i).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopFile.htm#old
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code802, vscode.DiagnosticSeverity.Warning);
        diag1.source = EDiagBase.source;
        diag1.code = EDiagCode.code802;
        return diag1;
    }

    // https://www.autohotkey.com/docs/commands/Loop.htm
    const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code201, vscode.DiagnosticSeverity.Error);
    diag1.source = EDiagBase.source;
    diag1.code = EDiagCode.code201;
    return diag1;
}

function getDirectivesErr(DocStrMap: TDocArr, line: number, uri: vscode.Uri): null | vscode.Diagnostic {
    // err of #Directives
    if ((/^\s*#/i).test(DocStrMap[line].lStr) === false) return null; // not loop
    // eslint-disable-next-line prefer-destructuring
    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*#(\w\w*)/).exec(lStr);
    if (exec === null) return null;
    const Directives = exec[1];
    const col = Math.max(0, lStr.indexOf(Directives));
    const Range = new vscode.Range(line, col, line, col + Directives.length);
    if ((/^EscapeChar$/i).test(Directives)) {
        // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code901, vscode.DiagnosticSeverity.Error);
        diag1.source = EDiagBase.source;
        diag1.code = EDiagCode.code901;
        return diag1;
    }
    if ((/^CommentFlag$/i).test(Directives)) {
        // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code902, vscode.DiagnosticSeverity.Error);
        diag1.source = EDiagBase.source;
        diag1.code = EDiagCode.code902;
        return diag1;
    }
    if ((/^(?:DerefChar|Delimiter)$/i).test(Directives)) {
        // change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code903, vscode.DiagnosticSeverity.Error);
        diag1.source = EDiagBase.source;
        diag1.code = EDiagCode.code903;
        return diag1;
    }
    return null;
}

function getCommandErr(DocStrMap: TDocArr, line: number, uri: vscode.Uri): null | vscode.Diagnostic {
    if ((/^\s*\w\w*\s*,/).test(DocStrMap[line].lStr) === false) return null; // not loop
    // eslint-disable-next-line prefer-destructuring
    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*(\w\w*)\s*,/).exec(lStr);
    if (exec === null) return null;
    const commandHead = exec[1];
    const temp = {
        exec: /^EnvMult$/i, // TODO EnvDiv
        EDiagCode: EDiagCode.code903, // TODO
    };
    // TODO ifEq https://wyagd001.github.io/zh-cn/docs/commands/IfEqual.htm
    // SetFormat -> Format  https://www.autohotkey.com/docs/commands/SetFormat.htm
    // StringMid -> SubStr() https://www.autohotkey.com/docs/commands/StringMid.htm
    // EscapeChar.htm
    return null;
}
type TFnLineErr = (DocStrMap: TDocArr, line: number, uri: vscode.Uri) => null | vscode.Diagnostic;

export function Diagnostic(DocStrMap: TDocArr, result: Readonly<MyDocSymbol[]>, uri: vscode.Uri, collection: vscode.DiagnosticCollection): void {
    const iMax = DocStrMap.length;
    let IgnoreLine = -1;
    const displayErr: boolean[] = [];
    const diagS: vscode.Diagnostic[] = [];
    const fnList: TFnLineErr[] = [assign, getLoopErr, getDirectivesErr];
    for (let line = 0; line < iMax; line++) {
        IgnoreLine = getIgnore(DocStrMap, line, IgnoreLine);
        if (line > IgnoreLine) {
            fnList.forEach((fn) => {
                const err = fn(DocStrMap, line, uri);
                if (err) diagS.push(err);
            });
            displayErr.push(true);
        } else {
            displayErr.push(false);
        }
    }

    diagS.push(...getTreeErr(result, displayErr));
    collection.set(uri, diagS);
}
