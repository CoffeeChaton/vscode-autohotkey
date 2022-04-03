/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,3,4,5] }] */
import * as vscode from 'vscode';
import { TAhkSymbol } from '../../globalEnum';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import {
    TArgAnalysis,
    TDeepAnalysisMeta,
    TTextAnalysis,
    TValAnalysis,
} from '../../tools/DeepAnalysis/TypeFnMeta';
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
    wordUp: string,
    listAllUsing: boolean,
    position: vscode.Position,
): vscode.Range[] | null {
    const DA: TDeepAnalysisMeta | null = getDAWithPos(document, position);
    if (DA === null) return null;

    const {
        argMap,
        valMap,
        textMap,
    } = DA;
    const argMeta: TArgAnalysis | undefined = argMap.get(wordUp);
    if (argMeta !== undefined) {
        const { defRangeList, refRangeList } = argMeta;
        return listAllUsing
            ? [...defRangeList, ...refRangeList]
            : defRangeList;
    }

    const valMeta: TValAnalysis | undefined = valMap.get(wordUp);
    if (valMeta !== undefined) {
        const { defRangeList, refRangeList } = valMeta;
        if (listAllUsing) return [...defRangeList, ...refRangeList];

        if (defRangeList[0].contains(position)) {
            // <
            // when I open "editor.gotoLocation.alternativeDefinitionCommand": "editor.action.goToReferences"
            // why vscode can't Identify range.contains(position)
            //      , and auto let F12 -> shift F12 ?
            //           (auto let goto Def -> Ref)
            // What else I need to read/Do?
            return [...defRangeList, ...refRangeList];
            // >
        }
        return defRangeList;
    }

    const textList: TTextAnalysis | undefined = textMap.get(wordUp);
    return textList
        ? textList.refRangeList
        : null;
}

function match(
    ahkSymbol: TAhkSymbol,
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): null | vscode.Range[] {
    const funcPos: EFuncPos = atFunPos(ahkSymbol, position);
    switch (funcPos) {
        case EFuncPos.isFuncArg:
            return wrapper(document, wordUp, true, position);
        case EFuncPos.isInBody:
            return wrapper(document, wordUp, listAllUsing, position);
        case EFuncPos.isFuncName:
            console.error('EFuncPos.isFuncName', wordUp, position); // is never now
            void vscode.window.showErrorMessage('EFuncPos.isFuncName', wordUp);
            return null;
        default:
            console.error('EFuncPos.isFuncName', wordUp, position); // is never now
            void vscode.window.showErrorMessage('EFuncPos.isFuncName', wordUp);
            return enumErr(funcPos);
    }
}

export function getValDefInFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): null | vscode.Location[] {
    const ahkSymbol: TAhkSymbol | null = getFnOfPos(document, position);
    if (ahkSymbol === null) return null;
    if (!kindPick(ahkSymbol.kind)) return null;

    const rangeList: vscode.Range[] | null = match(ahkSymbol, document, position, wordUp, listAllUsing);
    if (rangeList === null) return null;

    const { uri } = document;
    return rangeList.map((range) => new vscode.Location(uri, range));
}
