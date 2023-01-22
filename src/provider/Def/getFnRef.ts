/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import type { TAhkTokenLine } from '../../globalEnum';
import { CMemo } from '../../tools/CMemo';
import { getHotkeyWrap } from '../../tools/Command/HotkeyTools';
import { getSetTimerWrap } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { getDAListTop } from '../../tools/DeepAnalysis/getDAList';

type TLineFnCall = {
    upName: string,
    line: number,
    col: number,
};

// /**
//  * 1.lStr    exp funcName(
//  * 2. textRaw exp "funcName"
//  * 3. by Hotkey
//  * 4. by SetTimer
//  * by: 1 | 2 | 3 | 4
//  */
type TFuncRef = Omit<TLineFnCall, 'upName'>;

export function fnRefLStr(AhkTokenLine: TAhkTokenLine): TLineFnCall[] {
    const { lStr, line } = AhkTokenLine;
    const arr: TLineFnCall[] = [];
    for (const ma of lStr.matchAll(/(?<![.`%#])\b(\w+)\(/giu)) {
        // -------------------------------------------------^funcName(      of lStr
        const col: number | undefined = ma.index;
        if (col === undefined) continue;

        const upName: string = ma[1].toUpperCase();

        arr.push({
            upName,
            line,
            col,
        });
    }
    // don't search of
    // MsgBox,
    // (
    //   fnName()
    // )
    return arr;
}

export function fnRefTextRaw(AhkTokenLine: TAhkTokenLine): TLineFnCall[] {
    const { lStr, textRaw, line } = AhkTokenLine;
    const arr: TLineFnCall[] = [];
    for (const ma of textRaw.slice(0, lStr.length).matchAll(/(?<=")(\w+)"/giu)) {
        // ------------------------------------------------------------------------^funcName // of textRaw
        // RegisterCallback("funcName")
        // Func("funcName")
        //
        // text := "funcName"
        // Func(text)

        const col: number | undefined = ma.index;
        if (col === undefined) continue;

        const upName: string = ma[1].toUpperCase();

        arr.push({
            upName,
            line,
            col,
        });
    }
    // don't search of
    // MsgBox,
    // (
    //   "fnName"
    // )
    return arr;
}

const fileFuncRef = new CMemo<TAhkFileData, ReadonlyMap<string, TFuncRef[]>>(
    (AhkFileData: TAhkFileData): Map<string, TFuncRef[]> => {
        const { DocStrMap, AST } = AhkFileData;
        const filterLineList: number[] = getDAListTop(AST)
            .filter((DA: CAhkFunc): boolean => DA.kind === vscode.SymbolKind.Method)
            .map((DA: CAhkFunc): number => DA.nameRange.start.line);

        const map = new Map<string, TFuncRef[]>();
        for (const AhkTokenLine of DocStrMap) {
            const { line, lStr } = AhkTokenLine;
            if (lStr.length === 0) continue;
            if (filterLineList.includes(line)) continue;

            for (
                const { upName, col } of [...fnRefLStr(AhkTokenLine), ...fnRefTextRaw(AhkTokenLine)]
                    .sort((a: TLineFnCall, b: TLineFnCall): number => a.col - b.col)
            ) {
                const arr: TFuncRef[] = map.get(upName) ?? [];
                arr.push({
                    line,
                    col,
                });
                map.set(upName, arr);
            }

            for (const fn of [getSetTimerWrap, getHotkeyWrap]) {
                const Data: TScanData | null = fn(AhkTokenLine);
                if (Data !== null) {
                    const { RawNameNew, lPos } = Data;
                    const upName: string = RawNameNew.toUpperCase();
                    const arr: TFuncRef[] = map.get(upName) ?? [];
                    arr.push({
                        line,
                        col: lPos,
                    });
                    map.set(upName, arr);
                    break; // <-- only exists in one of the [getHotkeyWrap, getSetTimerWrap]
                }
            }
        }

        return map;
    },
);

export type TFnRefLike = {
    uri: vscode.Uri,
    line: number,
    col: number,
};

type TMap = Map<string, readonly TFnRefLike[]>;
const wm = new WeakMap<TAhkFileData, TMap>();

export function getFuncRef(funcSymbol: CAhkFunc): readonly TFnRefLike[] {
    const { upName } = funcSymbol;

    const allList: TFnRefLike[] = [];
    for (const AhkFileData of pm.getDocMapValue()) {
        const fileMap: TMap = wm.get(AhkFileData) ?? new Map<string, readonly TFnRefLike[]>();

        const oldList: readonly TFnRefLike[] | undefined = fileMap.get(upName);
        if (oldList !== undefined) {
            allList.push(...oldList);
            continue;
        }

        // set fileMap
        const { uri } = AhkFileData;
        const list: readonly TFnRefLike[] = (fileFuncRef.up(AhkFileData).get(upName) ?? [])
            .map(({ line, col }: TFuncRef): TFnRefLike => ({ uri, line, col }));

        allList.push(...list);

        fileMap.set(upName, list);
        wm.set(AhkFileData, fileMap);
    }
    // log.info(`find Ref of ${funcSymbol.name}() , use ${Date.now() - timeStart} ms`);
    return allList;
}

export function RefLike2Location(funcSymbol: CAhkFunc): vscode.Location[] {
    const refLikeList: readonly TFnRefLike[] = getFuncRef(funcSymbol);

    const wordUpLen: number = funcSymbol.upName.length;
    const arr1: vscode.Location[] = [];
    for (const re of refLikeList) {
        const { uri, line, col } = re;
        arr1.push(
            new vscode.Location(
                uri,
                new vscode.Range(
                    new vscode.Position(line, col),
                    new vscode.Position(line, col + wordUpLen),
                ),
            ),
        );
    }
    return arr1;
}
