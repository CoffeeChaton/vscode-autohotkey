/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,5] }] */
import * as vscode from 'vscode';
import { TAhkSymbol } from '../../globalEnum';
import { DeepAnalysis } from '../../tools/DeepAnalysis/DeepAnalysis';
import { enumErr } from '../../tools/enumErr';
import { kindPick } from '../../tools/Func/kindPick';
import { getFnOfPos } from '../../tools/getScopeOfPos';

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

function wrapper(
    document: vscode.TextDocument,
    ahkSymbol: TAhkSymbol,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] {
    const DA = DeepAnalysis(document, ahkSymbol);
    if (!DA) return [];
    const {
        argMap,
        valMap,
        textMap,
    } = DA;
    const argList = argMap.get(wordUp);
    if (argList) {
        return listAllUsing
            ? [...argList.defLoc, ...argList.refLoc]
            : [...argList.defLoc];
    }
    const valList = valMap.get(wordUp);
    if (valList) {
        return listAllUsing
            ? [...valList.defLoc, ...valList.refLoc]
            : [...valList.defLoc];
    }
    const textList = textMap.get(wordUp);
    if (textList) {
        return [...textList.refLoc];
    }
    return [];
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
        case EFuncPos.isFuncArg: return wrapper(document, ahkSymbol, wordUp, true);
        case EFuncPos.isInBody: return wrapper(document, ahkSymbol, wordUp, listAllUsing);
        case EFuncPos.isFuncName:
            console.error('EFuncPos.isFuncName', wordUp, position); // is never now
            void vscode.window.showErrorMessage('EFuncPos.isFuncName', wordUp);
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

    return match(ahkSymbol, document, position, wordUp, listAllUsing);
}
