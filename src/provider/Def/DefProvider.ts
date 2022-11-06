import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { OutputChannel } from '../vscWindows/OutputChannel';
import { getClassDef } from './getClassDef';
import { getDefSwitch } from './getDefSwitch';
import { getDefWithLabel } from './getDefWithLabel';
import type { TFnFindCol } from './getFuncReference';
import { getFuncReference } from './getFuncReference';
import { getValDefInFunc } from './getValDefInFunc';
import { isPosAtMethodName } from './isPosAtMethodName';

function searchHotkeyFuncRef(AhkTokenLine: TAhkTokenLine, wordUp: string): number {
    const HotkeyData: TScanData | null = getHotkeyWrap(AhkTokenLine);
    if (HotkeyData !== null && HotkeyData.RawNameNew.toUpperCase() === wordUp) {
        return HotkeyData.lPos;
    }
    return -1;
}

function searchSetTimerFuncRef(AhkTokenLine: TAhkTokenLine, wordUp: string): number {
    const setTimerData: TScanData | null = getSetTimerWrap(AhkTokenLine);
    if (setTimerData !== null && setTimerData.RawNameNew.toUpperCase() === wordUp) {
        return setTimerData.lPos;
    }
    return -1;
}

function fnMake(regBase: RegExp, wordUp: string): TFnFindCol {
    return (AhkTokenLine: TAhkTokenLine, partTextRaw: string): number[] => {
        //  funcName( | "funcName"
        const arr: number[] = [...partTextRaw.matchAll(regBase)].map((ma: RegExpMatchArray): number => ma.index ?? -1);

        const setTimerFuncCol: number = searchSetTimerFuncRef(AhkTokenLine, wordUp);
        if (setTimerFuncCol !== -1) {
            arr.push(setTimerFuncCol);
        }

        const HotkeyFuncCol: number = searchHotkeyFuncRef(AhkTokenLine, wordUp);
        if (HotkeyFuncCol !== -1) {
            arr.push(HotkeyFuncCol);
        }

        return arr;
    };
}

// TODO: spilt this func, just need input ahkFunc
export function userDefFunc(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const timeStart: number = Date.now();

    const { AST, DocStrMap } = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);

    if (isPosAtMethodName(getDAWithPos(AST, position), position)) return null;

    const funcSymbol: CAhkFunc | null = getFuncWithName(wordUp);
    if (funcSymbol === null) return null;

    const AhkTokenLine = DocStrMap[position.line];

    // funcName( | "funcName"
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regBase = new RegExp(
        `(?:(?<![.\`%])\\b(${wordUp})\\b\\()|(?:(?<=")(${wordUp})")`,
        //                          funcName(                  "funcName"
        'iug',
    );

    const refFn: TFnFindCol = fnMake(regBase, wordUp);

    if (document.getWordRangeAtPosition(position, regBase) === undefined) {
        let atFuncName = 0;

        const setTimerFuncCol: number = searchSetTimerFuncRef(AhkTokenLine, wordUp);
        if (setTimerFuncCol !== -1) atFuncName++;

        const HotkeyFuncCol: number = searchHotkeyFuncRef(AhkTokenLine, wordUp);
        if (HotkeyFuncCol !== -1) atFuncName++;

        if (atFuncName === 0) return null;
    }

    // c := c();
    // No   Yes check pos at like func()

    if (listAllUsing) return getFuncReference(refFn, timeStart, funcSymbol.name);

    if (
        (funcSymbol.uri.fsPath === document.uri.fsPath
            && funcSymbol.nameRange.contains(position))
    ) {
        // OK..i know who to go to References...
        // keep uri as old uri && return old pos/range
        // don't new vscode.Uri.file()
        return [new vscode.Location(document.uri, funcSymbol.nameRange)]; // let auto use getReference
    }

    OutputChannel.appendLine(`goto def of ${funcSymbol.name}() , use ${Date.now() - timeStart} ms`); // ssd -> 0~1ms
    return [new vscode.Location(funcSymbol.uri, funcSymbol.selectionRange)];
}

function DefProviderCore(
    document: vscode.TextDocument,
    position: vscode.Position,
): vscode.Location[] | null {
    const range: vscode.Range | undefined = document.getWordRangeAtPosition(position, /(?<![.`#])\b\w+\b/u);
    if (range === undefined) return null;
    const wordUp: string = document.getText(range).toUpperCase();

    if ((/^0x[A-F\d]+$/ui).test(wordUp) || (/^\d+$/ui).test(wordUp)) return null;

    const listAllUsing = false;

    const switchDef: vscode.Location[] | null = getDefSwitch(document, position, wordUp);
    if (switchDef !== null) return switchDef;

    const LabelDef: vscode.Location[] | null = getDefWithLabel(document, position, wordUp);
    if (LabelDef !== null) return LabelDef;

    const userDefFuncLink: vscode.Location[] | null = userDefFunc(document, position, wordUp, listAllUsing);
    if (userDefFuncLink !== null) return userDefFuncLink;

    const classDef: vscode.Location[] | null = getClassDef(wordUp, listAllUsing);
    if (classDef !== null) return classDef; // class name is variable name, should before function.variable name

    const valInFunc: vscode.Location[] | null = getValDefInFunc(document, position, wordUp, listAllUsing);
    if (valInFunc !== null) return valInFunc;

    return null;
}

/*
 * Go to Definition (via F12 || Ctrl+Click)
 * open the definition to the side with ( via Ctrl+Alt+Click )
 * Peek Definition (via Alt+F12)
 */
export const DefProvider: vscode.DefinitionProvider = {
    provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        _token: vscode.CancellationToken,
    ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        return DefProviderCore(document, position);
    },
};
