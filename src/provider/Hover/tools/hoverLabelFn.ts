import type * as vscode from 'vscode';
import type { CAhkFunc } from '../../../AhkSymbol/CAhkFunc';
import type { CAhkLabel } from '../../../AhkSymbol/CAhkLine';
import type { TAhkFileData } from '../../../core/ProjectManager';
import type { TAhkTokenLine } from '../../../globalEnum';
import { getGuiFunc } from '../../../tools/Command/GuiTools';
import type { TScanData } from '../../../tools/DeepAnalysis/FnVar/def/spiltCommandAll';
import { getFuncWithName } from '../../../tools/DeepAnalysis/getFuncWithName';
import { findLabel } from '../../../tools/labels';
import type { TFuncRef } from '../../Def/getFnRef';
import { fileFuncRef } from '../../Def/getFnRef';

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

    /**
     * fix gui GLabel = =||
     */
    const GuiDataList: readonly TScanData[] | null = getGuiFunc(AhkTokenLine, 0);
    const wordUpFix: string = GuiDataList !== null && wordUp.startsWith('G')
        ? wordUp.replace(/^g/iu, '')
        : wordUp;

    const locList: TFuncRef[] | undefined = refMap.get(wordUpFix);
    if (locList === undefined) return null;
    const { character, line } = position;

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
             * 7. by Sort <--- not allow find label
             * but case1 case2 don't using at this
             */

            // eslint-disable-next-line no-magic-numbers
            if (by !== 7) { // 7. by Sort <--- not allow find label
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
