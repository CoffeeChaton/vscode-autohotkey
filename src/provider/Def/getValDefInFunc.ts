/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,5] }] */
import * as vscode from 'vscode';
import { TAhkSymbol, VERSION } from '../../globalEnum';
import { enumErr } from '../../tools/enumErr';
import { kindPick } from '../../tools/Func/kindPick';
import { getFnOfPos } from '../../tools/getScopeOfPos';
import {
    ahkGlobalValDefRegex,
    ahkLocalValDefRegex,
    ahkStaticValDefRegex,
    ahkValDefRegex,
    ahkValRegex,
    ahkVarSetCapacityDefRegex,
} from '../../tools/regexTools';

const enum EFuncPos {
    isFuncName = 1,
    isFuncArg = 2,
    isInBody = 3,
}

function atFunPos(ahkSymbol: TAhkSymbol, position: vscode.Position): EFuncPos {
    if (ahkSymbol.selectionRange.contains(position)) return EFuncPos.isFuncArg;
    if (ahkSymbol.range.start.line === position.line) return EFuncPos.isFuncName;
    return EFuncPos.isInBody;
}

function searchValOfRange(document: vscode.TextDocument, searchRange: vscode.Range, regex: RegExp): vscode.Location[] {
    const TextRawList = document.getText(searchRange).split('\n');
    const startLine = searchRange.start.line;
    const List: vscode.Location[] = [];
    for (let i = 0; i < TextRawList.length; i++) {
        const col = TextRawList[i].search(regex);
        if (col > -1) {
            const line = i + startLine;
            List.push(new vscode.Location(document.uri, new vscode.Position(line, col)));
        }
    }

    return List;
}

function wrapper(
    document: vscode.TextDocument,
    position: vscode.Position,
    ahkSymbol: TAhkSymbol,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] {
    const regex = ahkValRegex(wordUp);
    if (listAllUsing) {
        console.log(`list ${wordUp} all using,is ${VERSION.getValDefInFunc}`);
        return searchValOfRange(document, ahkSymbol.range, regex);
    }

    const argDef = searchValOfRange(document, ahkSymbol.selectionRange, regex);
    if (argDef.length > 0) return argDef;

    const defLocation: vscode.Location[] = [];

    [
        ahkStaticValDefRegex(wordUp),
        ahkLocalValDefRegex(wordUp),
        ahkGlobalValDefRegex(wordUp),
        ahkVarSetCapacityDefRegex(wordUp),
        ahkValDefRegex(wordUp),
    ].forEach((reg) => {
        const loc = searchValOfRange(document, ahkSymbol.range, reg);
        if (loc.length > 0) {
            console.log(`list ${wordUp} definition ,is ${VERSION.getValDefInFunc}`);
            defLocation.push(...loc);
        }
    });
    if (defLocation.some((loc) => position.line === loc.range.start.line)) {
        return searchValOfRange(document, ahkSymbol.range, regex);
    }

    return defLocation;
}

function match(
    ahkSymbol: TAhkSymbol,
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): null | vscode.Location[] {
    const funcPos = atFunPos(ahkSymbol, position);
    // dprint-ignore
    switch (funcPos) {
        case EFuncPos.isFuncArg: return wrapper(document, position, ahkSymbol, wordUp, true);
        case EFuncPos.isInBody: return wrapper(document, position, ahkSymbol, wordUp, listAllUsing);
        case EFuncPos.isFuncName:
            console.log('EFuncPos.isFuncName', wordUp, position); // is never now
            return null;
        default:
            return enumErr(funcPos);
    }
}

export function getValDefInFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): null | vscode.Location[] {
    const ahkSymbol = getFnOfPos(document, position);
    if (!ahkSymbol) return null;
    if (!kindPick(ahkSymbol.kind)) return null;

    const ed: null | vscode.Location[] = match(ahkSymbol, document, position, wordUp, listAllUsing);
    return ed;
}
