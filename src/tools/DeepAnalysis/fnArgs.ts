import * as vscode from 'vscode';
import {
    TArgList, TArgListVal, TAhkSymbol, TTokenStream,
} from '../../globalEnum';
import { getCommentOfLine } from '../getCommentOfLine';
import { ahkValRegex } from '../regexTools';
import { replacerSpace } from '../removeSpecialChar';

function setArgDef(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TArgList {
    const argList: TArgList = new Map<string, TArgListVal>();
    const startLine = ahkSymbol.selectionRange.start.line;
    const endLine = ahkSymbol.selectionRange.end.line;
    for (const { lStr, textRaw, line } of DocStrMap) {
        if (line > endLine) break;
        let lStrFix = lStr;
        if (startLine === line) lStrFix = lStrFix.replace(/^\s*\w\w*\(/, '');
        if (endLine === line) lStrFix = lStrFix.replace(/\)\s*\{?\s*$/, '');

        lStrFix
            .replace(/:?=\s*[_\d.]+/g, replacerSpace)
            .split(',')
            .map((v) => v.trim())
            .forEach((argName) => {
                const isByRef = (/^ByRef\s\s*/i).test(argName);
                const key0 = isByRef ? argName.replace(/^ByRef\s\s*/i, '') : argName;
                if (key0 === '') return;
                const isVariadic = (/^\w\w*\*$/).test(argName);
                const keyRawName = isVariadic ? key0.replace(/\*$/, '') : key0;
                if (!(/^\w\w*$/).test(keyRawName)) {
                    const message = `DeepAnalysis NekoHelp Unknown Syntax of ${ahkSymbol.name} args Error ${keyRawName}`;
                    vscode.window.showInformationMessage(message);
                    throw new Error(message);
                }
                const character = lStrFix.search(ahkValRegex(argName));
                const pos = new vscode.Position(line, character);
                const value: TArgListVal = {
                    keyRawName,
                    defLoc: [new vscode.Location(uri, pos)],
                    refLoc: [],
                    commentList: [getCommentOfLine({ lStr, textRaw }) ?? ''],
                    isByRef,
                    isVariadic,
                };
                const key = keyRawName.toUpperCase();
                argList.set(key, value);
            });
    }

    return argList;
}

export function setArgList(uri: vscode.Uri, ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): TArgList {
    const argList: TArgList = setArgDef(uri, ahkSymbol, DocStrMap);
    argList.forEach((v, argName) => {
        DocStrMap.forEach(({ lStr, textRaw, line }) => {
            const character = textRaw.search(ahkValRegex(argName));
            if (character !== -1) {
                const pos = new vscode.Position(line, character);
                const loc = new vscode.Location(uri, pos);
                v.refLoc.push(loc);
                const comment = getCommentOfLine({ textRaw, lStr });
                if (comment) v.commentList.push();
            }
        });
    });
    return argList;
}
