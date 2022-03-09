/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines */
import * as vscode from 'vscode';
import { getLintConfig } from '../../configUI';
import { EDiagCode } from '../../diag';
import {
    DetailType,
    EDiagBase,
    TAhkSymbol,
    TAhkSymbolList,
    TTokenStream,
} from '../../globalEnum';
import { ClassWm } from '../../tools/wm';
import { getTreeErr } from './getTreeErr';
import { setDiagnostic } from './setDiagnostic';

function getIgnore(DocStrMap: TTokenStream, line: number, IgnoreLine: number): number {
    // ;@ahk-ignore 30 line.
    // textRaw
    if (DocStrMap[line].textRaw.indexOf(EDiagBase.ignore) === -1) return IgnoreLine;
    const ignoreExec = (/^\s*;@ahk-ignore\s+(\d+)\s/iu).exec(DocStrMap[line].textRaw);
    if (ignoreExec === null) {
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
    const { lStr } = DocStrMap[line];
    const exec = (/^\s*Loop\b[\s,]+(\w+)/iu).exec(lStr);
    if (exec === null) return 0;
    const SecondSection = exec[1];
    if ((/^(?:\d+|Files|Parse|Read|Reg)$/ui).test(SecondSection)) return 1;

    // eslint-disable-next-line no-magic-numbers
    const position = Math.max(0, lStr.search(/\bloop\b/iu)) + 4;
    const col = Math.max(0, lStr.indexOf(SecondSection, position));
    const range = new vscode.Range(line, col, line, col + SecondSection.length);
    if ((/^RootKey$/ui).test(SecondSection)) {
        // https://www.autohotkey.com/docs/commands/LoopReg.htm#old
        const value = EDiagCode.code801;
        const tags = [vscode.DiagnosticTag.Deprecated];
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Warning, tags);
    }
    if ((/^FilePattern$/ui).test(SecondSection)) {
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
    if (!(/^\s*#/ui).test(DocStrMap[line].lStr)) return 0;

    const { lStr } = DocStrMap[line];
    const exec = (/^\s*#(\w+)/u).exec(lStr);
    if (exec === null) return 0;
    const Directives = exec[1];
    const col = Math.max(0, lStr.indexOf(Directives));
    const range = new vscode.Range(line, col, line, col + Directives.length);
    if ((/^EscapeChar$/ui).test(Directives)) {
        // change of ` https://www.autohotkey.com/docs/commands/_EscapeChar.htm
        const value = EDiagCode.code901;
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Error, []);
    }
    if ((/^CommentFlag$/ui).test(Directives)) {
        // change of ; https://www.autohotkey.com/docs/commands/_CommentFlag.htm
        const value = EDiagCode.code902;
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Error, []);
    }
    if ((/^(?:DerefChar|Delimiter)$/ui).test(Directives)) {
        // change of % , #DerefChar https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related
        const value = EDiagCode.code903;
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Error, []);
    }
    return 1;
}

function getCommandErrFnReplace(commandHead: string, lStr: string, line: number): null | vscode.Diagnostic {
    // Command -> func https://www.autohotkey.com/docs/Language.htm#commands-vs-functions
    if (
        (/^(?:File(Append|GetAttrib|Read)|GetKeyState|IfExist|IfInString|IfWin(?:Not)?(?:Active|Exist))$/ui).test(
            commandHead,
        )
        || (/^String(?:GetPos|Len|Replace|Split|Lower|Upper|Left|Mid|Right|TrimLeft|TrimRight)$/ui).test(commandHead)
    ) {
        const col = lStr.indexOf(commandHead);
        const range = new vscode.Range(line, col, line, col + commandHead.length);
        const value = EDiagCode.code700;
        const tags = [vscode.DiagnosticTag.Deprecated];
        return setDiagnostic(value, range, vscode.DiagnosticSeverity.Warning, tags);
    }
    return null;
}

function getCommandErr(DocStrMap: TTokenStream, line: number): 0 | 1 | vscode.Diagnostic {
    // if (h.indexOf(line) !== -1) return 1;
    if (!(/^\s*\w+[\s,]/u).test(DocStrMap[line].lStr)) return 0;
    const { lStr } = DocStrMap[line];
    const exec = (/^\s*(\w+)[\s,]/u).exec(lStr);
    if (exec === null) return 0;
    const commandHead = exec[1];
    if ((/^(?:switch|case|if|while|else|return|Break|for|sleep)$/ui).test(commandHead)) return 1;

    const fnReplaceErr = getCommandErrFnReplace(commandHead, lStr, line);
    if (fnReplaceErr) return fnReplaceErr;
    if ((/^Loop$/ui).test(commandHead)) return getLoopErr(DocStrMap, line);

    type TCommandErr = {
        reg: RegExp;
        code: EDiagCode;
    };
    const headMatch: TCommandErr[] = [
        {
            reg: /^EnvDiv$/ui,
            code: EDiagCode.code803,
        },
        {
            reg: /^EnvMult$/ui,
            code: EDiagCode.code804,
        },
        {
            reg: /^GetKeyState$/ui,
            code: EDiagCode.code805,
        },
        {
            reg: /^If(?:Equal|NotEqual|Less|LessOrEqual|Greater|GreaterOrEqual)$/ui,
            code: EDiagCode.code806,
        },
        {
            reg: /^If(?:Exist|NotExist)$/ui,
            code: EDiagCode.code807,
        },
        {
            reg: /^If(?:Not)?InString$/ui,
            code: EDiagCode.code808,
        },
        {
            reg: /^IfWin(?:Not)?Active$/ui,
            code: EDiagCode.code809,
        },
        {
            reg: /^IfWin(?:Not)?Exist$/ui,
            code: EDiagCode.code810,
        },
        {
            reg: /^SplashImage|Progress$/ui,
            code: EDiagCode.code813,
        },
        {
            reg: /^SetEnv$/ui,
            code: EDiagCode.code814,
        },
        {
            reg: /^SetFormat$/ui,
            code: EDiagCode.code815,
        },
        {
            reg: /^SplashText(?:On|Off)$/ui,
            code: EDiagCode.code816,
        },
        {
            reg: /^StringGetPos$/ui,
            code: EDiagCode.code817,
        },
        {
            reg: /^String(?:Left|Right)/ui,
            code: EDiagCode.code818,
        },
        {
            reg: /^StringLen/ui,
            code: EDiagCode.code819,
        },
        {
            reg: /^StringMid$/ui,
            code: EDiagCode.code820,
        },
        {
            reg: /^StringReplace$/ui,
            code: EDiagCode.code821,
        },
        {
            reg: /^StringSplit$/ui,
            code: EDiagCode.code822,
        },
        {
            reg: /^StringTrim(?:Left|Right)$/ui,
            code: EDiagCode.code823,
        },
        {
            reg: /^Transform$/ui,
            code: EDiagCode.code824,
        },
    ];

    for (const v of headMatch) {
        if (v.reg.test(commandHead)) {
            const col = lStr.search(commandHead);
            const range = new vscode.Range(line, col, line, col + commandHead.length);
            const tags: vscode.DiagnosticTag[] = [vscode.DiagnosticTag.Deprecated];
            return setDiagnostic(v.code, range, vscode.DiagnosticSeverity.Warning, tags);
        }
    }
    // Reg,,,... i need to Count colon  ??
    return 1;
}

function getLabelErr(DocStrMap: TTokenStream, line: number): 0 | 1 | vscode.Diagnostic {
    // if (h.indexOf(line) !== -1) return 1;
    if (DocStrMap[line].lStr.indexOf(':') < 1) return 0;
    const { lStr } = DocStrMap[line];
    const exec = (/^\s*(\w+)\s*:/u).exec(lStr);
    if (exec === null) return 0;
    const labName = exec[1];
    type TLabelErr = {
        reg: RegExp;
        code: EDiagCode;
    };
    const headMatch: TLabelErr[] = [
        {
            reg: /^OnClipboardChange$/ui,
            code: EDiagCode.code811,
        },
        {
            reg: /^OnExit$/ui,
            code: EDiagCode.code812,
        },
    ];
    for (const v of headMatch) {
        if (v.reg.test(labName)) {
            const col = lStr.search(labName);
            const range = new vscode.Range(line, col, line, col + labName.length);
            const tags: vscode.DiagnosticTag[] = [vscode.DiagnosticTag.Deprecated];
            return setDiagnostic(v.code, range, vscode.DiagnosticSeverity.Warning, tags);
        }
    }

    return 1;
}

type TFnLineErr = (DocStrMap: TTokenStream, line: number) => 0 | 1 | vscode.Diagnostic;

function getLineErr(DocStrMap: TTokenStream, line: number): null | vscode.Diagnostic {
    const fnList: TFnLineErr[] = [assign, getDirectivesErr, getCommandErr, getLabelErr];
    for (const fn of fnList) {
        const err = fn(DocStrMap, line);
        // dprint-ignore
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
        fnSize += DocStrMap[line].lStr === ''
            ? 0
            : 1;
        if (fnSize >= maxFnSize) return true;
    }
    return false;
}

function getFuncErr(
    DocStrMap: TTokenStream,
    funcS: TAhkSymbolList,
    displayErr: readonly boolean[],
): vscode.Diagnostic[] {
    const digS: vscode.Diagnostic[] = [];
    for (const func of funcS) {
        switch (func.kind) {
            case vscode.SymbolKind.Method:
            case vscode.SymbolKind.Function:
                if (
                    displayErr[func.range.start.line]
                    && fnErrCheck(DocStrMap, func)
                ) {
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

// eslint-disable-next-line no-magic-numbers
const wm = new ClassWm<TTokenStream, vscode.Diagnostic[]>(10 * 60 * 1000, 'baseDiagnostic', 3000);

export function baseDiagnostic(
    DocStrMap: TTokenStream,
    AhkSymbolList: TAhkSymbolList,
): vscode.Diagnostic[] {
    const cache = wm.getWm(DocStrMap);
    if (cache) return cache;

    const lineMax: number = DocStrMap.length;
    let IgnoreLine = -1;
    const displayErr: boolean[] = [];
    const lineDiagS: vscode.Diagnostic[] = [];
    // const h = symbolList(result);
    for (let line = 0; line < lineMax; line++) {
        IgnoreLine = getIgnore(DocStrMap, line, IgnoreLine);
        if (line <= IgnoreLine) {
            displayErr.push(false);
            continue;
        }
        displayErr.push(true);
        const err = getLineErr(DocStrMap, line);
        if (err !== null) lineDiagS.push(err);
    }

    const diagList = [
        ...lineDiagS,
        ...getTreeErr(AhkSymbolList, displayErr),
        ...getFuncErr(DocStrMap, AhkSymbolList, displayErr),
    ];
    return wm.setWm(DocStrMap, diagList);
}
// TODO  vscode.languages.getDiagnostics()
