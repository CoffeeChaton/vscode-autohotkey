import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { CAhkLabel } from '../../AhkSymbol/CAhkLine';
import { pm } from '../../core/ProjectManager';
import { getHotkeyData } from '../../tools/Command/HotkeyTools';
import type { TScanData } from '../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { findLabel } from '../../tools/labels';

function LabelRefHotkey(
    {
        line,
        wordUp,
        lStr,
        fistWordUpCol,
    }: { line: number; wordUp: string; lStr: string; fistWordUpCol: number },
): vscode.Range | null {
    const HotkeyData: TScanData | null = getHotkeyData(lStr, fistWordUpCol);
    if (HotkeyData === null) return null;

    const { RawNameNew, lPos } = HotkeyData;
    if (RawNameNew.toUpperCase() !== wordUp) return null;

    return new vscode.Range(
        new vscode.Position(line, lPos),
        new vscode.Position(line, lPos + RawNameNew.length),
    );
}

function getLabelRef(wordUp: string): vscode.Location[] {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(`(\\b(?:goto|goSub|Break|Continue|SetTimer)\\b\\s*,?\\s*)\\b${wordUp}\\b`, 'iu');

    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri } of pm.getDocMapValue()) {
        for (
            const {
                line,
                lStr,
                fistWordUp,
                fistWordUpCol,
            } of DocStrMap
        ) {
            if (fistWordUp === 'HOTKEY') {
                const range: vscode.Range | null = LabelRefHotkey({
                    line,
                    wordUp,
                    lStr,
                    fistWordUpCol,
                });
                if (range !== null) List.push(new vscode.Location(uri, range));

                continue;
            }

            const ma: RegExpMatchArray | null = lStr.match(reg);
            if (ma === null) continue;
            const { index } = ma;
            if (index === undefined) continue;
            const col: number = ma[1].length + index;

            List.push(
                new vscode.Location(
                    uri,
                    new vscode.Range(
                        new vscode.Position(line, col),
                        new vscode.Position(line, col + wordUp.length),
                    ),
                ),
            );
        }
    }

    return List;
}

export function posAtLabelDef(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUp: string,
): vscode.Location[] | null {
    const { DocStrMap } = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    const { lStr } = DocStrMap[position.line];

    if ((/^\w+:$/u).test(lStr.trim())) {
        return getLabelRef(wordUp);
    }
    return null;
}

function getDefWithLabelCore(wordUpCase: string): vscode.Location[] | null {
    const label: CAhkLabel | null = findLabel(wordUpCase);
    if (label === null) {
        return null;
    }
    const { range, uri } = label;
    const Location: vscode.Location = new vscode.Location(uri, range);
    return [Location];
}

/**
 * i will not support this case...
 *
 * ```ahk
 * GroupAdd, GroupName , WinTitle, WinText, Label, ExcludeTitle, ExcludeText
 *                                          ^
 * ;            ... The label is jumped to as though a Gosub had been used.
 * ```
 */

export function getDefWithLabel(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUpCase: string,
): vscode.Location[] | null {
    const { DocStrMap } = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    const { lStr, fistWordUp, fistWordUpCol } = DocStrMap[position.line];
    const lStrFix: string = lStr.slice(0, Math.max(0, position.character));

    if ((/^\w+:$/u).test(lStr.trim())) {
        return [new vscode.Location(document.uri, position)]; // let auto call Ref
    }

    if ((/\b(?:goto|goSub|Break|Continue|OnExit)\b[\s,]+\w*$/ui).test(lStrFix)) {
        // OnExit , Label
        return getDefWithLabelCore(wordUpCase);
    }

    if (fistWordUp === 'HOTKEY') {
        const HotkeyData: TScanData | null = getHotkeyData(lStr, fistWordUpCol);
        if (HotkeyData?.RawNameNew.toUpperCase() === wordUpCase) return getDefWithLabelCore(wordUpCase);
    }

    const ma: RegExpMatchArray | null = lStrFix.match(/\b(SetTimer\b[\s,%]+)\w*$/ui);
    if (ma !== null) {
        /**
         * ma1 has "%" -> aVar->HasObject()  ----> getValDefInFunc()
         *
         * ```c++
         * IObject *Script::FindCallable(LPTSTR aLabelName, Var *aVar, int aParamCount) {
         *     if (aVar && aVar->HasObject())
         *     if (Label *label = FindLabel(aLabelName))
         *     if (Func *func = FindFunc(aLabelName))
         *     //...
         * }
         * ```
         */
        const ma1: string = ma[1];
        if (ma1.includes('%')) {
            // no search funcObj in this way.  ----> getValDefInFunc()
            return null;
        }

        /**
         * ```c++
         * if (Label *label = FindLabel(aLabelName))
         * ```
         */
        const label: vscode.Location[] | null = getDefWithLabelCore(wordUpCase);
        if (label !== null) return label;

        /**
         * ```c++
         * if (Func *func = FindFunc(aLabelName))
         * ```
         */
        const fn: CAhkFunc | null = getFuncWithName(wordUpCase);
        if (fn !== null) return [new vscode.Location(fn.uri, fn.range)];
    }

    return null;
}

// unknown...
// {_T("GroupAdd"), 1, 6, 6, NULL} // Group name, WinTitle, WinText, Label, exclude-title/text
// {_T("Menu"), 2, 6, 6, NULL}  // tray, add, name, label, options, future use
