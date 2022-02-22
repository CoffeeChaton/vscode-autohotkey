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

function setArgDef(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TArgMap {
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

        for (const argName of strList) {
            const isByRef = (/^ByRef\s+/ui).test(argName);
            const key0 = isByRef
                ? argName.replace(/^ByRef\s+/ui, '')
                : argName;
            if (key0 === '') continue;
            const isVariadic = (/^\w+\*$/u).test(argName); // https://ahkde.github.io/docs/Functions.htm#Variadic
            const keyRawName = isVariadic
                ? key0.replace(/\*$/u, '')
                : key0;
            if (!(/^\w+$/u).test(keyRawName)) {
                const errCode = '--99--37--21--';
                const errMsg = 'DeepAnalysis NekoHelp Unknown Syntax of ';
                const errLoc = `${uri.fsPath} line : ${line + 1}`;
                const message = `${errMsg} ${ahkSymbol.name} args Error ${keyRawName}${errCode}${errLoc}`;
                console.error('.forEach ~ message', message);
                void vscode.window.showErrorMessage(message);
                throw new Error(message);
            }
            const character = lStr.search(ahkValRegex(argName));
            const range = new vscode.Range(
                new vscode.Position(line, character),
                new vscode.Position(line, character + keyRawName.length),
            );
            const value: TArgAnalysis = {
                keyRawName,
                defLoc: [new vscode.Location(uri, range)],
                refLoc: [],
                isByRef,
                isVariadic,
            };
            const key = keyRawName.toUpperCase();
            argMap.set(key, value);
        }
    }

    return argMap;
}

export function setArgMap(
    uri: vscode.Uri,
    ahkSymbol: TAhkSymbol,
    DocStrMap: TTokenStream,
): [TArgMap, vscode.Diagnostic[]] {
    const argMap: TArgMap = setArgDef(uri, ahkSymbol, DocStrMap);
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
    const diagS: vscode.Diagnostic[] = [];
    // FIXME s = argName
    argMap.forEach((v): void => {
        if (!(v.refLoc.length === 0)) return;
        if (v.keyRawName.startsWith('_')) return;
        const { range } = v.defLoc[0];
        const severity = vscode.DiagnosticSeverity.Warning;
        const tags = [vscode.DiagnosticTag.Unnecessary];
        const diag = setDiagnostic(EDiagCode.code501, range, severity, tags);
        diagS.push(diag);
    });
    return [argMap, diagS];
}
