import * as vscode from 'vscode';
import {
    TArgList as TArgMap, TArgListVal, TAhkSymbol, TTokenStream,
} from '../../globalEnum';

import { getCommentOfLine } from '../getCommentOfLine';
import { ahkValRegex } from '../regexTools';
import { replacerSpace } from '../removeSpecialChar';

function setArgDef(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TArgMap {
    const argMap: TArgMap = new Map<string, TArgListVal>();
    const startLine = ahkSymbol.selectionRange.start.line;
    const endLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, textRaw, line } of DocStrMap) {
        if (line > endLine) break;
        let lStrFix = lStr;
        if (startLine === line) lStrFix = lStrFix.replace(/^\s*\w\w*\(/, '');
        if (endLine === line) lStrFix = lStrFix.replace(/\)\s*\{?\s*$/, '');

        const e5 = lStrFix
            .replace(/:?=\s*[_\d.]+/g, replacerSpace)
            .split(',')
            .map((v) => v.trim());

        for (const argName of e5) {
            const isByRef = (/^ByRef\s\s*/i).test(argName);
            const key0 = isByRef ? argName.replace(/^ByRef\s\s*/i, '') : argName;
            if (key0 === '') continue;
            const isVariadic = (/^\w\w*\*$/).test(argName); // https://ahkde.github.io/docs/Functions.htm#Variadic
            const keyRawName = isVariadic ? key0.replace(/\*$/, '') : key0;
            if (!(/^\w\w*$/).test(keyRawName)) {
                const message = `DeepAnalysis NekoHelp Unknown Syntax of ${ahkSymbol.name} args Error ${keyRawName}--99--37--21--`;
                console.log('.forEach ~ message', message);
                vscode.window.showInformationMessage(message);
                throw new Error(message);
            }
            const character = lStr.search(ahkValRegex(argName));
            const range = new vscode.Range(
                new vscode.Position(line, character),
                new vscode.Position(line, character + keyRawName.length),
            );
            const value: TArgListVal = {
                keyRawName,
                defLoc: [new vscode.Location(uri, range)],
                refLoc: [],
                commentList: [getCommentOfLine({ lStr, textRaw }) ?? ''],
                isByRef,
                isVariadic,
            };
            const key = keyRawName.toUpperCase();
            argMap.set(key, value);
        }
    }

    return argMap;
}

export function setArgMap(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TArgMap {
    const argMap: TArgMap = setArgDef(uri, ahkSymbol, DocStrMap);
    argMap.forEach((v, argName) => {
        const startLine = ahkSymbol.selectionRange.end.line;
        for (const { lStr, textRaw, line } of DocStrMap) {
            if (line <= startLine) continue;
            const character = lStr.search(ahkValRegex(argName));
            if (character !== -1) {
                const range = new vscode.Range(
                    new vscode.Position(line, character),
                    new vscode.Position(line, character + argName.length),
                );
                const loc = new vscode.Location(uri, range);
                v.refLoc.push(loc);
                const comment = getCommentOfLine({ textRaw, lStr });
                if (comment) {
                    v.commentList.push(comment);
                }
            }
        }
    });
    return argMap;
}
