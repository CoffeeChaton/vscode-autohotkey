import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { CAhkLabel } from '../../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { getFuncWithName } from '../../../tools/DeepAnalysis/getFuncWithName';
import { findLabel } from '../../../tools/labels';
import type { TFuncRef } from '../../Def/getFnRef';
import { EFnRefBy, fileFuncRef } from '../../Def/getFnRef';
import { getFucDefWordUpFix } from '../../Def/getFucDefWordUpFix';

/**
 * ```ahk
 * c
 * ```
 */
export function hoverLabelOrFunc(
    AhkFileData: TAhkFileData,
    AhkTokenLine: TAhkTokenLine,
    wordUp: string,
    position: vscode.Position,
): vscode.MarkdownString | null {
    const refMap: ReadonlyMap<string, TFuncRef[]> = fileFuncRef.up(AhkFileData);
    const { character, line } = position;
    const wordUpFix: string = getFucDefWordUpFix(AhkTokenLine, wordUp, character);

    const locList: TFuncRef[] | undefined = refMap.get(wordUpFix);
    if (locList === undefined) return null;

    for (const { line: refLine, col, by } of locList) {
        if (
            (refLine === line)
            && by > 2
            && (col <= character && (col + wordUpFix.length) >= character)
        ) {
            /**
             * 1. by funcName(
             * 2. by "funcName"
             * 3. by SetTimer
             * 4. by Hotkey
             * 5. by Menu
             * 6. by Gui
             * 7. by Sort
             * 8. by (?CCallout) https://www.autohotkey.com/docs/v1/misc/RegExCallout.htm#callout-functions
             */
            // FIXME i need to san check
            // eslint-disable-next-line no-magic-numbers
            if (by < EFnRefBy.Sort) { // 7. by Sort <--- not allow find label
                const label: CAhkLabel | null = findLabel(wordUpFix);
                if (label !== null) return label.md;
            }

            const fn: CAhkFunc | null = getFuncWithName(wordUpFix);
            if (fn !== null) return fn.md;

            return null;
        }
    }
    return null;
}
