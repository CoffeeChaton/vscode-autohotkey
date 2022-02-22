import * as vscode from 'vscode';
import { EDiagCode } from '../../diag';
import {
    TAhkSymbol,
    TArgAnalysis,
    TArgMap,
    TTokenStream,
} from '../../globalEnum';
import { setDiagnostic } from '../../provider/Diagnostic/setDiagnostic';
import { ahkValRegex } from '../regexTools';
import { replacerSpace } from '../removeSpecialChar';

function getNeed(argName: string, uri: vscode.Uri, line: number, lStr: string): null | TArgAnalysis {
    const isByRef = (/^ByRef\s+/ui).test(argName);
    const key0 = isByRef
        ? argName.replace(/^ByRef\s+/ui, '')
        : argName;
    if (key0 === '') return null;
    const isVariadic = (/^\w+\*$/u).test(argName); // https://ahkde.github.io/docs/Functions.htm#Variadic
    const keyRawName = isVariadic
        ? key0.replace(/\*$/u, '')
        : key0;
    if (!(/^\w+$/u).test(keyRawName)) {
        const errCode = '--99--37--21--';
        const errMsg = 'DeepAnalysis NekoHelp Unknown Syntax of ';
        const errLoc = `${uri.fsPath} line : ${line + 1}`;
        const message = `${errMsg} args Error ${keyRawName}${errCode}${errLoc}`;
        console.error('.forEach ~ message', message);
        void vscode.window.showErrorMessage(message);
        throw new Error(message);
    }

    // just keyRawName now
    const character = lStr.search(ahkValRegex(keyRawName));
    const range = new vscode.Range(
        new vscode.Position(line, character),
        new vscode.Position(line, character + keyRawName.length),
    );
    return {
        keyRawName,
        defLoc: [new vscode.Location(uri, range)],
        refLoc: [],
        isByRef,
        isVariadic,
    };
}

function getParamDef(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TArgMap {
    const argMap: TArgMap = new Map<string, TArgAnalysis>();
    const startLine = ahkSymbol.selectionRange.start.line;
    const endLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line > endLine) break;
        let lStrFix = lStr;
        if (startLine === line) lStrFix = lStrFix.replace(/^\s*\w+\(/u, '');
        if (endLine === line) lStrFix = lStrFix.replace(/\)\s*\{?\s*$/u, '');

        const strList: string[] = lStrFix
            .replace(/:?=\s*[-+.\w]+/ug, replacerSpace) // Test 0x00ffffff  , -0.5 , 0.8
            .split(',')
            .map((v) => v.trim());

        for (const param of strList) {
            const value = getNeed(param, uri, line, lStr);
            if (value === null) continue;

            const key = value.keyRawName.toUpperCase();
            argMap.set(key, value);
        }
    }

    return argMap;
}

function paramNeverUsed(argMap: TArgMap): vscode.Diagnostic[] {
    const diagS: vscode.Diagnostic[] = [];
    argMap.forEach((v): void => {
        if (!(v.refLoc.length === 0)) return;
        if (v.keyRawName.startsWith('_')) return;
        const { range } = v.defLoc[0];
        const severity = vscode.DiagnosticSeverity.Warning;
        const tags = [vscode.DiagnosticTag.Unnecessary];
        const diag = setDiagnostic(EDiagCode.code501, range, severity, tags);
        diagS.push(diag);
    });
    return diagS;
}

type TSetArgMap = {
    argMap: TArgMap;
    diagArgs: vscode.Diagnostic[];
};

function setParamRef(argMap: TArgMap, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream, uri: vscode.Uri): void {
    argMap.forEach((v, argName): void => {
        const startLine = ahkSymbol.selectionRange.end.line;
        for (const { lStr, line } of DocStrMap) {
            if (line <= startLine) continue;
            const character = lStr.search(ahkValRegex(argName));
            if (character !== -1) {
                const range = new vscode.Range(
                    new vscode.Position(line, character),
                    new vscode.Position(line, character + argName.length),
                );
                const loc = new vscode.Location(uri, range);
                v.refLoc.push(loc);
            }
        }
    });
}
export function setArgMap(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): TSetArgMap {
    const argMap: TArgMap = getParamDef(uri, ahkSymbol, DocStrMap);
    setParamRef(argMap, ahkSymbol, DocStrMap, uri);

    const diagArgs: vscode.Diagnostic[] = paramNeverUsed(argMap);
    return {
        argMap,
        diagArgs,
    };
}
