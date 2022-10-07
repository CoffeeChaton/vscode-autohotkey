import * as vscode from 'vscode';
import type { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { CAhkLabel } from '../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { getFuncWithName } from '../../tools/DeepAnalysis/getFuncWithName';
import { findLabel } from '../../tools/labels';

function getLabelRef(wordUp: string): vscode.Location[] {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const reg = new RegExp(`\\b((?:goto|goSub|Break|Continue|SetTimer)\\b[\\s,]+)\\b${wordUp}\\b`, 'iu');
    const refFn = (lineStr: string): RegExpMatchArray | null => lineStr.match(reg);

    const List: vscode.Location[] = [];
    for (const { DocStrMap, uri } of pm.getDocMapValue()) {
        for (const { line, lStr } of DocStrMap) {
            const ma: RegExpMatchArray | null = refFn(lStr);
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
    const AhkFileData: TAhkFileData = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    const { DocStrMap } = AhkFileData;
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
 *
 * ```ahk
 * Hotkey, KeyName , Label, Options
 *                    ^
 * ```
 */

export function getDefWithLabel(
    document: vscode.TextDocument,
    position: vscode.Position,
    wordUpCase: string,
): vscode.Location[] | null {
    const AhkFileData: TAhkFileData = pm.getDocMap(document.uri.fsPath) ?? pm.updateDocDef(document);
    const { DocStrMap } = AhkFileData;
    const { lStr } = DocStrMap[position.line];
    const lStrFix: string = lStr.slice(0, Math.max(0, position.character));

    if ((/^\w+:$/u).test(lStr.trim())) {
        return [new vscode.Location(document.uri, position)]; // let auto call Ref
    }

    if ((/\b(?:goto|goSub|Break|Continue)\b[\s,]+\w*$/ui).test(lStrFix)) {
        return getDefWithLabelCore(wordUpCase);
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
