import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { OutputChannel } from '../vscWindows/OutputChannel';
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

type TFnFindCol = (AhkTokenLine: TAhkTokenLine, partTextRaw: string) => number[];

function getFuncReferenceCore(
    refFn: TFnFindCol,
    AhkFileData: TAhkFileData,
    wordUpLen: number,
): readonly vscode.Location[] {
    const List: vscode.Location[] = [];
    const { DocStrMap, AST, uri } = AhkFileData;
    const filterLineList: number[] = getDAListTop(AST)
        .filter((DA: CAhkFunc): boolean => DA.kind === vscode.SymbolKind.Method)
        .map((DA: CAhkFunc): number => DA.nameRange.start.line);

    for (const AhkTokenLine of DocStrMap) {
        const { textRaw, line, lStr } = AhkTokenLine;

        if (/* lStr.trim().length === 0 || */ filterLineList.includes(line)) {
            continue;
        }

        for (const col of refFn(AhkTokenLine, textRaw.slice(0, lStr.length))) {
            if (col === -1) {
                continue;
            }

            const Location: vscode.Location = new vscode.Location(
                uri,
                new vscode.Range(
                    new vscode.Position(line, col),
                    new vscode.Position(line, col + wordUpLen),
                ),
            );
            List.push(Location);
        }
    }

    return List;
}

type TMap = Map<string, readonly vscode.Location[]>;
const wm = new WeakMap<TAhkFileData, TMap>();

export function getFuncReference(refFn: TFnFindCol, timeStart: number, funcSymbolName: string): vscode.Location[] {
    const wordUp: string = funcSymbolName.toUpperCase();
    const wordUpLen: number = wordUp.length;

    const allList: vscode.Location[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const oldMap: TMap = wm.get(AhkFileData) ?? new Map<string, readonly vscode.Location[]>();

        const oldList: readonly vscode.Location[] | undefined = oldMap.get(wordUp);
        if (oldList !== undefined) {
            allList.push(...oldList);
            continue;
        }

        //
        const list: readonly vscode.Location[] = getFuncReferenceCore(refFn, AhkFileData, wordUpLen);
        allList.push(...list);

        oldMap.set(wordUp, list);
        wm.set(AhkFileData, oldMap);
    }
    OutputChannel.appendLine(`find Ref of ${funcSymbolName}() , use ${Date.now() - timeStart} ms`);
    return allList;
}

// TODO: spilt this func, just need input ahkFunc
export function getFuncDef(
    document: vscode.TextDocument, // TODO: remove this
    position: vscode.Position,
    wordUp: string,
    listAllUsing: boolean,
): vscode.Location[] | null {
    const timeStart: number = Date.now();

    const AhkFileData: TAhkFileData | null = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    if (AhkFileData === null) return null;
    const { AST, DocStrMap } = AhkFileData;

    if (isPosAtMethodName(getDAWithPos(AST, position), position)) return null;

    const funcSymbol: CAhkFunc | null = getFuncWithName(wordUp);
    if (funcSymbol === null) return null;

    const AhkTokenLine = DocStrMap[position.line];

    // funcName( | "funcName"
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regBase = new RegExp(
        `(?:(?<![.\`%])\\b(${wordUp})\\b\\()|(?:(?<=")(${wordUp})")`,
        //                          funcName(                  "funcName"
        // --------------------------------------------------- RegisterCallback("funcName") or Func("funcName")
        'iug',
    );

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

    if (listAllUsing) return getFuncReference(fnMake(regBase, wordUp), timeStart, funcSymbol.name);

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
