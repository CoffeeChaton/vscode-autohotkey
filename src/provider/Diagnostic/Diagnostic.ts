/* eslint-disable max-lines */
import * as vscode from 'vscode';
import {
    TDocArr, EDiagBase, EDiagCode, EDiagMsg, MyDocSymbol, DetailType, EDiagFsPath,
} from '../../globalEnum';
import { getTreeErr } from './getTreeErr';

function getIgnore(DocStrMap: TDocArr, line: number, IgnoreLine: number): number {
    // ;@ahk-ignore 30 line.
    // textRaw
    if (DocStrMap[line].textRaw.indexOf(EDiagBase.ignore) === -1) return IgnoreLine;
    const ignoreExec = (/^\s*;@ahk-ignore\s\s*(\d\d*)\s/).exec(DocStrMap[line].textRaw);
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

function assign(DocStrMap: TDocArr, line: number, uri: vscode.Uri): 0 | 1 | vscode.Diagnostic {
    // https://www.autohotkey.com/docs/commands/SetEnv.htm
    if (!DocStrMap[line].detail.includes(DetailType.inSkipSign2)) return 0;

    const col = DocStrMap[line].textRaw.indexOf('=');
    const Range = new vscode.Range(line, col, line, DocStrMap[line].textRaw.length);
    const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code107, vscode.DiagnosticSeverity.Information);
    diag1.source = EDiagBase.source;
    diag1.code = {
        value: EDiagCode.code107,
        target: vscode.Uri.parse(EDiagFsPath.code107),
    };
    //   diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(uri, pos), 'suggest to use := not =')];
    return diag1;
}
function getLoopErr(DocStrMap: TDocArr, line: number, uri: vscode.Uri): 0 | 1 | vscode.Diagnostic {
    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*Loop\b[\s,][\s,]*(\w\w*)/i).exec(lStr);
    if (exec === null) return 0;
    const SecondSection = exec[1];
    if ((/^(?:\d\d*|Files|Parse|Read|Reg)$/i).test(SecondSection)) return 1;

    // eslint-disable-next-line no-magic-numbers
    const position = Math.max(0, lStr.search(/\bloop\b/i)) + 4;
    const col = Math.max(0, lStr.indexOf(SecondSection, position));
    const Range = new vscode.Range(line, col, line, col + SecondSection.length);
    if ((/^RootKey$/i).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopReg.htm#old
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code801, vscode.DiagnosticSeverity.Warning);
        diag1.source = EDiagBase.source;
        diag1.code = {
            value: EDiagCode.code801,
            target: vscode.Uri.parse(EDiagFsPath.code801),
        };
        return diag1;
    }
    if ((/^FilePattern$/i).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopFile.htm#old
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code802, vscode.DiagnosticSeverity.Warning);
        diag1.source = EDiagBase.source;
        diag1.code = {
            value: EDiagCode.code802,
            target: vscode.Uri.parse(EDiagFsPath.code802),
        };
        return diag1;
    }

    // https://www.autohotkey.com/docs/commands/Loop.htm
    const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code201, vscode.DiagnosticSeverity.Error);
    diag1.source = EDiagBase.source;
    diag1.code = {
        value: EDiagCode.code201,
        target: vscode.Uri.parse(EDiagFsPath.code201),
    };
    return diag1;
}

function getDirectivesErr(DocStrMap: TDocArr, line: number, uri: vscode.Uri): 0 | 1 | vscode.Diagnostic {
    // err of #Directives
    if (DocStrMap[line].lStr.indexOf('#') === -1) return 0;
    if ((/^\s*#/i).test(DocStrMap[line].lStr) === false) return 0;

    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*#(\w\w*)/).exec(lStr);
    if (exec === null) return 0;
    const Directives = exec[1];
    const col = Math.max(0, lStr.indexOf(Directives));
    const Range = new vscode.Range(line, col, line, col + Directives.length);
    if ((/^EscapeChar$/i).test(Directives)) {
        // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code901, vscode.DiagnosticSeverity.Error);
        diag1.source = EDiagBase.source;
        diag1.code = {
            value: EDiagCode.code901,
            target: vscode.Uri.parse(EDiagFsPath.code901),
        };
        return diag1;
    }
    if ((/^CommentFlag$/i).test(Directives)) {
        // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code902, vscode.DiagnosticSeverity.Error);
        diag1.source = EDiagBase.source;
        diag1.code = {
            value: EDiagCode.code902,
            target: vscode.Uri.parse(EDiagFsPath.code902),
        };
        return diag1;
    }
    if ((/^(?:DerefChar|Delimiter)$/i).test(Directives)) {
        // change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code903, vscode.DiagnosticSeverity.Error);
        diag1.source = EDiagBase.source;
        diag1.code = {
            value: EDiagCode.code903,
            target: vscode.Uri.parse(EDiagFsPath.code903),
        };
        return diag1;
    }
    return 1;
}

function getCommandErr(DocStrMap: TDocArr, line: number, uri: vscode.Uri): 0 | 1 | vscode.Diagnostic {
    // TODO result: Readonly<MyDocSymbol[]>
    // TODO search Deprecated
    // if (h.indexOf(line) !== -1) return 1;
    if ((/^\s*\w\w*[\s,]/).test(DocStrMap[line].lStr) === false) return 0;
    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*(\w\w*)[\s,]/).exec(lStr);
    if (exec === null) return 0;
    const commandHead = exec[1];
    const col = lStr.indexOf(commandHead);
    const Range = new vscode.Range(line, col, line, col + commandHead.length);
    // TODO
    if ((/^(?:File(Append|GetAttrib|Read)|GetKeyState|IfExist|IfInString|IfWin(Active|Exist))$/i).test(commandHead)
        || (/^String(?:GetPos|Len|Replace|Split|Lower|Upper|Left|Mid|Right|TrimLeft|TrimRight)$/i).test(commandHead)) {
        // Command -> func https://www.autohotkey.com/docs/Language.htm#commands-vs-functions
        const diag1 = new vscode.Diagnostic(Range, EDiagMsg.code700, vscode.DiagnosticSeverity.Warning);
        diag1.source = EDiagBase.source;
        diag1.code = {
            value: EDiagCode.code700,
            target: vscode.Uri.parse(EDiagFsPath.code700),
        };
        return diag1;
    }

    if ((/^Loop$/i).test(commandHead)) return getLoopErr(DocStrMap, line, uri);

    const temp = {
        exec: /^EnvMult$/i, // TODO EnvDiv
        EDiagCode: EDiagCode.code903, // TODO
    };
    // TODO ifEq https://wyagd001.github.io/zh-cn/docs/commands/IfEqual.htm
    // SetFormat -> Format  https://www.autohotkey.com/docs/commands/SetFormat.htm
    // StringMid -> SubStr() https://www.autohotkey.com/docs/commands/StringMid.htm
    // EscapeChar.htm
    return 1;
}
type TFnLineErr = (DocStrMap: TDocArr, line: number, uri: vscode.Uri) => 0 | 1 | vscode.Diagnostic;

function wrapFnErr(DocStrMap: TDocArr, line: number, uri: vscode.Uri): null | vscode.Diagnostic {
    const fnList: TFnLineErr[] = [assign, getDirectivesErr, getCommandErr];
    for (const fn of fnList) {
        const err = fn(DocStrMap, line, uri);
        switch (err) {
            case 0: break;
            case 1: return null;
            default: return err;
        }
    }
    return null;
}

function deepSymbol(chList: Readonly<MyDocSymbol[]>, h: Set<number>): void {
    for (const ch of chList) {
        h.add(ch.range.start.line);
        if (ch.children.length !== 0) {
            deepSymbol(ch.children, h);
        }
    }
}
function symbolList(result: Readonly<MyDocSymbol[]>): Set<number> {
    const h: Set<number> = new Set();
    deepSymbol(result, h);
    // console.log('symbolList ~ h', h);
    return h;
}
export function Diagnostic(DocStrMap: TDocArr, result: Readonly<MyDocSymbol[]>, uri: vscode.Uri, collection: vscode.DiagnosticCollection): void {
    const lineMax = DocStrMap.length;
    let IgnoreLine = -1;
    const displayErr: boolean[] = [];
    const diagS: vscode.Diagnostic[] = [];
    // const h = symbolList(result);
    for (let line = 0; line < lineMax; line++) {
        IgnoreLine = getIgnore(DocStrMap, line, IgnoreLine);
        if (line <= IgnoreLine) {
            displayErr.push(false);
            continue;
        }
        displayErr.push(true);
        const err = wrapFnErr(DocStrMap, line, uri);
        if (err !== null) diagS.push(err);
    }

    diagS.push(...getTreeErr(result, displayErr));
    collection.set(uri, diagS);
}
// TODO  vscode.languages.getDiagnostics()
