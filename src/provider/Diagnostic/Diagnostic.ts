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

function getCommandsErr(DocStrMap: TDocArr, line: number, uri: vscode.Uri): null | vscode.Diagnostic {
    // Loop, FilePattern -> Loop, Files, FilePattern   https://www.autohotkey.com/docs/commands/LoopFile.htm#old
    // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
    // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
    // #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
    // #Delimiter https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
    // SetFormat -> Format  https://www.autohotkey.com/docs/commands/SetFormat.htm
    // StringMid -> SubStr() https://www.autohotkey.com/docs/commands/StringMid.htm
    // EscapeChar.htm
    return null;
}
export function Diagnostic(DocStrMap: TDocArr, result: Readonly<MyDocSymbol[]>, uri: vscode.Uri, collection: vscode.DiagnosticCollection): void {
    const iMax = DocStrMap.length;
    let IgnoreLine = -1;
    const displayErr: boolean[] = [];
    const diagS: vscode.Diagnostic[] = [];
    for (let line = 0; line < iMax; line++) {
        IgnoreLine = getIgnore(DocStrMap, line, IgnoreLine);
        if (line > IgnoreLine) {
            const assignEnd = assign(DocStrMap, line, uri);
            if (assignEnd) diagS.push(assignEnd);
            displayErr.push(true);
        } else {
            displayErr.push(false);
        }
    }

    diagS.push(...getTreeErr(result, displayErr));
    collection.set(uri, diagS);
}
