/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { getLintConfig } from '../../configUI';
import {
    TTokenStream, EDiagBase, EDiagCode, TAhkSymbol, DetailType,
} from '../../globalEnum';

import { getTreeErr } from './getTreeErr';
import { setDiagnostic } from './setDiagnostic';

function getIgnore(DocStrMap: TTokenStream, line: number, IgnoreLine: number): number {
    // ;@ahk-ignore 30 line.
    // textRaw
    if (DocStrMap[line].textRaw.indexOf(EDiagBase.ignore) === -1) return IgnoreLine;
    const ignoreExec = (/^\s*;@ahk-ignore\s\s*(\d\d*)\s/).exec(DocStrMap[line].textRaw);
    if (ignoreExec === null) {
        // console.log('function getIgnore -> ignoreExec === null');
        // console.log(line, ' line');
        return IgnoreLine;
    }
    const numberOfIgnore = Number(ignoreExec[1]);
    return numberOfIgnore + line;
}

function assign(DocStrMap: TTokenStream, line: number): 0 | 1 | vscode.Diagnostic {
    // https://www.autohotkey.com/docs/commands/SetEnv.htm
    if (!DocStrMap[line].detail.includes(DetailType.inSkipSign2)) return 0;

    const col = DocStrMap[line].textRaw.indexOf('=');
    //   diag1.relatedInformation = [new vscode.DiagnosticRelatedInformation(new vscode.Location(uri, pos), 'suggest to use := not =')];

    const range = new vscode.Range(line, col, line, DocStrMap[line].textRaw.length);
    const value = EDiagCode.code107;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Information, []);
}
function getLoopErr(DocStrMap: TTokenStream, line: number): 0 | 1 | vscode.Diagnostic {
    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*Loop\b[\s,][\s,]*(\w\w*)/i).exec(lStr);
    if (exec === null) return 0;
    const SecondSection = exec[1];
    if ((/^(?:\d\d*|Files|Parse|Read|Reg)$/i).test(SecondSection)) return 1;

    const position = Math.max(0, lStr.search(/\bloop\b/i)) + 4;
    const col = Math.max(0, lStr.indexOf(SecondSection, position));
    const range = new vscode.Range(line, col, line, col + SecondSection.length);
    if ((/^RootKey$/i).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopReg.htm#old
        const value = EDiagCode.code801;
        const tags = [vscode.DiagnosticTag.Deprecated];
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Warning, tags);
    }
    if ((/^FilePattern$/i).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopFile.htm#old
        const value = EDiagCode.code802;
        const tags = [vscode.DiagnosticTag.Deprecated];
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Warning, tags);
    }

    // https://www.autohotkey.com/docs/commands/Loop.htm
    const value = EDiagCode.code201;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Error, []);
}

function getDirectivesErr(DocStrMap: TTokenStream, line: number): 0 | 1 | vscode.Diagnostic {
    // err of #Directives
    if (DocStrMap[line].lStr.indexOf('#') === -1) return 0;
    if (!(/^\s*#/i).test(DocStrMap[line].lStr)) return 0;

    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*#(\w\w*)/).exec(lStr);
    if (exec === null) return 0;
    const Directives = exec[1];
    const col = Math.max(0, lStr.indexOf(Directives));
    const range = new vscode.Range(line, col, line, col + Directives.length);
    if ((/^EscapeChar$/i).test(Directives)) {
        // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
        const value = EDiagCode.code901;
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Error, []);
    }
    if ((/^CommentFlag$/i).test(Directives)) {
        // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
        const value = EDiagCode.code902;
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Error, []);
    }
    if ((/^(?:DerefChar|Delimiter)$/i).test(Directives)) {
        // change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
        const value = EDiagCode.code903;
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Error, []);
    }
    return 1;
}
function getCommandErrFnReplace(commandHead: string, lStr: string, line: number): null | vscode.Diagnostic {
    if ((/^(?:File(Append|GetAttrib|Read)|GetKeyState|IfExist|IfInString|IfWin(Active|Exist))$/i).test(commandHead)
        || (/^String(?:GetPos|Len|Replace|Split|Lower|Upper|Left|Mid|Right|TrimLeft|TrimRight)$/i).test(commandHead)) {
        const col = lStr.indexOf(commandHead);
        const range = new vscode.Range(line, col, line, col + commandHead.length);
        // Command -> func https://www.autohotkey.com/docs/Language.htm#commands-vs-functions
        const value = EDiagCode.code700;
        const tags = [vscode.DiagnosticTag.Deprecated];
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Warning, tags);
    }
    return null;
}
function getCommandErr(DocStrMap: TTokenStream, line: number): 0 | 1 | vscode.Diagnostic {
    // TODO result: Readonly<MyDocSymbol[]>
    // TODO search Deprecated
    // if (h.indexOf(line) !== -1) return 1;
    if (!(/^\s*\w\w*[\s,]/).test(DocStrMap[line].lStr)) return 0;
    const lStr = DocStrMap[line].lStr;
    const exec = (/^\s*(\w\w*)[\s,]/).exec(lStr);
    if (exec === null) return 0;
    const commandHead = exec[1];
    if ((/^switch|case|if|while|else|return|Break|for|sleep$/i).test(commandHead)) return 1;

    const fnReplaceErr = getCommandErrFnReplace(commandHead, lStr, line);
    if (fnReplaceErr) return fnReplaceErr;
    if ((/^Loop$/i).test(commandHead)) return getLoopErr(DocStrMap, line);

    const temp = {
        exec: /^EnvMult$/i, // TODO EnvDiv
        EDiagCode: EDiagCode.code903,
    };
    // TODO ifEq https://wyagd001.github.io/zh-cn/docs/commands/IfEqual.htm
    // SetFormat -> Format  https://www.autohotkey.com/docs/commands/SetFormat.htm
    // StringMid -> SubStr() https://www.autohotkey.com/docs/commands/StringMid.htm
    // EscapeChar.htm
    return 1;
}
type TFnLineErr = (DocStrMap: TTokenStream, line: number, uri: vscode.Uri) => 0 | 1 | vscode.Diagnostic;

function getLineErr(DocStrMap: TTokenStream, line: number, uri: vscode.Uri): null | vscode.Diagnostic {
    const fnList: TFnLineErr[] = [assign, getDirectivesErr, getCommandErr];
    for (const fn of fnList) {
        const err = fn(DocStrMap, line, uri);
        switch (err) {
            case 0: break; // break switch
            case 1: return null;
            default: return err;
        }
    }
    return null;
}

function setFuncErr(func: TAhkSymbol): vscode.Diagnostic {
    const value = EDiagCode.code301;
    const range = func.selectionRange;
    return setDiagnostic(value, range, vscode.DiagnosticSeverity.Warning, []);
}
function fnErrCheck(DocStrMap: TTokenStream, func: TAhkSymbol): boolean {
    const maxFnSize = getLintConfig().funcSize;
    let fnSize = 0;
    const st = func.selectionRange.end.line;
    const ed = func.range.end.line;
    if (ed - st < maxFnSize) return false;
    for (let line = st; line < ed; line++) {
        fnSize += DocStrMap[line].lStr === '' ? 0 : 1;
        if (fnSize >= maxFnSize) return true;
    }
    return false;
}
function getFuncErr(DocStrMap: TTokenStream, funcS: Readonly<TAhkSymbol[]>, displayErr: readonly boolean[]): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const func of funcS) {
        switch (func.kind) {
            case vscode.SymbolKind.Method:
            case vscode.SymbolKind.Function:
                if (displayErr[func.range.start.line]
                    && fnErrCheck(DocStrMap, func)) {
                    digS.push(setFuncErr(func));
                }
                break;
            case vscode.SymbolKind.Class:
                digS.push(...getFuncErr(DocStrMap, func.children, displayErr));
                break;
            default:
                break;
        }
    }
    return digS;
}
export function Diagnostic(DocStrMap: TTokenStream, result: Readonly<TAhkSymbol[]>, uri: vscode.Uri, collection: vscode.DiagnosticCollection): void {
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
        const err = getLineErr(DocStrMap, line, uri);
        if (err !== null) diagS.push(err);
    }

    diagS.push(
        ...getTreeErr(result, displayErr),
        ...getFuncErr(DocStrMap, result, displayErr),
    );
    collection.set(uri, diagS);
}
// TODO  vscode.languages.getDiagnostics()
