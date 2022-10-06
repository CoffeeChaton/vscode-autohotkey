import * as vscode from 'vscode';
import type { CAhkLabel } from '../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../core/ProjectManager';
import { pm } from '../../core/ProjectManager';
import { findLabel } from '../../tools/labels';

function getDefWithLabelCore(wordUpCase: string): vscode.Location[] | null {
    const timeStart = Date.now();
    const label: CAhkLabel | null = findLabel(wordUpCase);
    if (label === null) {
        return null;
    }
    const { range, uri } = label;
    const Location: vscode.Location = new vscode.Location(uri, range);
    //
    console.log(`🚀 goto def of "${wordUpCase}"`, Date.now() - timeStart, 'ms'); // ssd -> 4ms
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

    // i don't wtf of this case..
    // SetTimer , LabelOrFunc, PeriodOnOffDelete, Priority
    if ((/\b(goto|goSub|Break|Continue)\b[\s,].*\w+$/ui).test(lStrFix)) {
        return getDefWithLabelCore(wordUpCase);
    }

    return null;
}

/**
 * ```c++
 *    Label *Line::GetJumpTarget(bool aIsDereferenced)
 * ```
 * or this...
 * ```c++
 *     IObject *Script::FindCallable(LPTSTR aLabelName, Var *aVar, int aParamCount)
 * ```
 */
