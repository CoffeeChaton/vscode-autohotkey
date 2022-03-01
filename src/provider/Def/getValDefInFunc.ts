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
    position: vscode.Position,
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
            ? [...argList.defLocList, ...argList.refLocList]
            : argList.defLocList;
    }
    const valList = valMap.get(wordUp);
    if (valList) {
        if (listAllUsing) return [...valList.defLocList, ...valList.refLocList];
        // <
        // when I open "editor.gotoLocation.alternativeDefinitionCommand": "editor.action.goToReferences"
        // why vscode can't Identify loc.range.contains(position)
        //      , and auto let F12 -> shift F12 ?
        //           (auto let goto Def -> Ref)
        // What else do I need to read?
        for (const loc of valList.defLocList) {
            if (loc.range.contains(position)) {
                return [...valList.defLocList, ...valList.refLocList];
            }
        }
        // >
        return valList.defLocList;
    }
    const textList = textMap.get(wordUp);
    if (textList) {
        return textList.refLoc;
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
        case EFuncPos.isFuncArg: return wrapper(document, ahkSymbol, wordUp, true, position);
        case EFuncPos.isInBody: return wrapper(document, ahkSymbol, wordUp, listAllUsing, position);
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
