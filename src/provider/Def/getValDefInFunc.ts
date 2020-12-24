/* eslint-disable security/detect-non-literal-regexp */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,5] }] */
import * as vscode from 'vscode';
import { MyDocSymbol, VERSION } from '../../globalEnum';
import { getFnOfPos } from '../../tools/getScopeOfPos';

const enum EFuncPos {
    isFuncName = 1,
    isFuncArg = 2,
    isInBody = 3,
}

function atFunPos(docSymbol: MyDocSymbol, document: vscode.TextDocument, position: vscode.Position): EFuncPos {
    if (docSymbol.selectionRange.contains(position)) return EFuncPos.isFuncArg;
    if (docSymbol.range.start.line === position.line) return EFuncPos.isFuncName;
    return EFuncPos.isInBody;
}

function searchValOfRange(document: vscode.TextDocument, searchRange: vscode.Range, regex: RegExp)
    : vscode.Location[] {
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

function wrapper(document: vscode.TextDocument, docSymbol: MyDocSymbol, wordLower: string, listAllUsing: boolean)
    : vscode.Location[] {
    const regex = new RegExp(`(?<!\\.|\`)\\b${wordLower}\\b`, 'i');
    if (listAllUsing) {
        console.log(`list ${wordLower} all using,is ${VERSION.getValDefInFunc}`);
        return searchValOfRange(document, docSymbol.range, regex);
    }

    const argDef = searchValOfRange(document, docSymbol.selectionRange, regex);
    if (argDef.length > 0) return argDef;

    const Location: vscode.Location[] = [];
    [
        new RegExp(`\\bstatic\\b.*\\b${wordLower}\\b`, 'i'),
        new RegExp(`\\blocal\\b.*\\b${wordLower}\\b`, 'i'),
        new RegExp(`\\bglobal\\b.*\\b${wordLower}\\b`, 'i'),
        new RegExp(`\\bVarSetCapacity\\b\\(${wordLower}\\b`, 'i'),
        new RegExp(`\\b${wordLower}\\b\\s*:=`, 'i'),
    ].forEach((reg) => {
        const loc = searchValOfRange(document, docSymbol.range, reg);
        if (loc.length > 0) {
            console.log(`list ${wordLower} definition ,is ${VERSION.getValDefInFunc}`);
            Location.push(...loc);
        }
    });

    return Location;
}
function neverLog(funcPos: never): null {
    console.log('enum error of getValDefInFunc--93--61--74--');
    return null;
}
export function getValDefInFunc(document: vscode.TextDocument, position: vscode.Position, wordLower: string, listAllUsing: boolean)
    : null | vscode.Location[] {
    const docSymbol = getFnOfPos(document, position);
    if (!docSymbol) return null;

    const funcPos = atFunPos(docSymbol, document, position);
    switch (funcPos) {
        case EFuncPos.isFuncArg: return wrapper(document, docSymbol, wordLower, true);
        case EFuncPos.isInBody: return wrapper(document, docSymbol, wordLower, listAllUsing);
        case EFuncPos.isFuncName:
            console.log('EFuncPos.isFuncName', wordLower, position); // is never now
            return null;
        default: return neverLog(funcPos);
    }
}
