import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import { getHotkeyData } from '../../tools/Command/HotkeyTools';
import { getSetTimerData } from '../../tools/Command/SetTimerTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { getDAList } from '../../tools/DeepAnalysis/getDAList';
import { getDAWithPos } from '../../tools/DeepAnalysis/getDAWithPos';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { getClassDef } from './getClassDef';
import { getDefWithLabel } from './getDefWithLabel';
import { getValDefInFunc } from './getValDefInFunc';
import { isPosAtMethodName } from './isPosAtMethodName';

type TFnFindCol = (lnlStr: string, lnFistWordUp: string, lnFistWordUpCol: number) => number[];

function getReference(refFn: TFnFindCol, timeStart: number, wordUp: string): vscode.Location[] {
    const List: vscode.Location[] = [];
    for (const { DocStrMap, AST, uri } of pm.getDocMapValue()) {
        const filterLineList: number[] = getDAList(AST)
            .filter((DA: CAhkFunc): boolean => DA.kind === vscode.SymbolKind.Method)
            .map((DA: CAhkFunc): number => DA.nameRange.start.line);

        for (
            const {
                textRaw,
                line,
                lStr,
                fistWordUp,
                fistWordUpCol,
            } of DocStrMap
        ) {
            if (/* lStr.trim().length === 0 || */ filterLineList.includes(line)) continue;

            for (const col of refFn(textRaw.slice(0, lStr.length), fistWordUp, fistWordUpCol)) {
                if (col === -1) continue;

                const Location: vscode.Location = new vscode.Location(
                    uri,
                    new vscode.Range(
                        new vscode.Position(line, col),
                        new vscode.Position(line, col + wordUp.length),
                    ),
                );
                List.push(Location);
            }
        }
    }
    console.log(`🚀 list all using of "${wordUp}"`, Date.now() - timeStart, 'ms'); // ssd -> 9~11ms (if not gc)
    return List;
}

function fnMake(regBase: RegExp, wordUp: string): TFnFindCol {
    return (lnlStr: string, lnFistWordUp: string, lnFistWordUpCol: number): number[] => {
        //  funcName( | "funcName"
        const arr: number[] = [...lnlStr.matchAll(regBase)].map((ma: RegExpMatchArray): number => ma.index ?? -1);

        if (lnFistWordUp === 'SETTIMER') {
            const setTimerData: TScanData | null = getSetTimerData(lnlStr, lnFistWordUpCol);
            if (setTimerData !== null && setTimerData.RawNameNew.toUpperCase() === wordUp) {
                arr.push(setTimerData.lPos);
            }
        } else if (lnFistWordUp === 'HOTKEY') {
            const HotkeyData: TScanData | null = getHotkeyData(lnlStr, lnFistWordUpCol);
            if (HotkeyData !== null && HotkeyData.RawNameNew.toUpperCase() === wordUp) {
                arr.push(HotkeyData.lPos);
            }
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

    const { lStr, fistWordUp, fistWordUpCol } = DocStrMap[position.line];

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

        if (fistWordUp === 'SETTIMER') {
            const setTimerData: TScanData | null = getSetTimerData(lStr, fistWordUpCol);
            if (setTimerData?.RawNameNew.toUpperCase() === wordUp) atFuncName = 1;
        } else if (fistWordUp === 'HOTKEY') {
            const HotkeyData: TScanData | null = getHotkeyData(lStr, fistWordUpCol);
            if (HotkeyData?.RawNameNew.toUpperCase() === wordUp) atFuncName = 1;
        }

        if (atFuncName === 0) return null;
    }

    // c := c();
    // No   Yes check pos at like func()

    if (listAllUsing) return getReference(refFn, timeStart, wordUp);

    if (
        (funcSymbol.uri.fsPath === document.uri.fsPath
            && funcSymbol.nameRange.contains(position))
    ) {
        // OK..i know who to go to References...
        // keep uri as old uri && return old pos/range
        // don't new vscode.Uri.file()
        return [new vscode.Location(document.uri, funcSymbol.nameRange)]; // let auto use getReference
    }

    console.log(`🚀 goto def of "${wordUp}"`, Date.now() - timeStart, 'ms'); // ssd -> 0~1ms
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
