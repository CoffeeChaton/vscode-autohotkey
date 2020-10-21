/* eslint-disable @typescript-eslint/no-unused-vars */
import * as vscode from 'vscode';
import { getSkipSign2 } from '../../tools/removeSpecialChar';
import {
    TDocArr, EDiagBase, EDiagCode, EDiagMsg, MyDocSymbol,
} from '../../globalEnum';
import { getSwErr } from './getSwErr';

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
    if (!getSkipSign2(DocStrMap[line].lStr)) return null;

    let col = DocStrMap[line].lStr.indexOf('=');
    if (col === -1) col = 0;
    const Range = new vscode.Range(line, col, line, DocStrMap[line].lStr.length);

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
    // SetFormat -> Format  https://www.autohotkey.com/docs/commands/SetFormat.htm
    // StringMid -> SubStr() https://www.autohotkey.com/docs/commands/StringMid.htm
    return null;
}
export function Diagnostic(DocStrMap: TDocArr, result: Readonly<MyDocSymbol[]>, uri: vscode.Uri, collection: vscode.DiagnosticCollection): void {
    const iMax = DocStrMap.length;
    let IgnoreLine = -1;
    const showErr: boolean[] = []; // 1 is mean can show Err
    const diagS: vscode.Diagnostic[] = [];
    for (let line = 0; line < iMax; line++) {
        IgnoreLine = getIgnore(DocStrMap, line, IgnoreLine);
        if (line > IgnoreLine) {
            const assignEnd = assign(DocStrMap, line, uri);
            if (assignEnd) diagS.push(assignEnd);
            showErr.push(true);
        } else {
            showErr.push(false);
        }
    }

    getSwErr(result, showErr).forEach((e) => diagS.push(e));

    collection.set(uri, diagS);
}
