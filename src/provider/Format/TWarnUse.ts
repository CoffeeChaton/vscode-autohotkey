/* eslint-disable max-lines-per-function */
import * as vscode from 'vscode';
import type { DeepReadonly, TAhkTokenLine } from '../../globalEnum';
import { lineReplace } from './fmtReplace';
import type { TDiffMap } from './tools/fmtDiffInfo';
import { getDeepLTrim } from './tools/getDeepLTrim';

type TWarnUse =
    & DeepReadonly<{
        lStrTrim: string,
        occ: number,
        bracketsDeep: number,
        options: vscode.FormattingOptions,
        switchDeep: number,
        topLabelDeep: 0 | 1,
        formatTextReplace: boolean,
    }>
    & {
        DiffMap: TDiffMap,
    };

function wrap(args: TWarnUse, text: string, AhkTokenLine: TAhkTokenLine): vscode.TextEdit {
    const { lStrTrim, DiffMap, formatTextReplace } = args;
    const { line, textRaw } = AhkTokenLine;

    const newText: string = formatTextReplace
        ? lineReplace(AhkTokenLine, text, lStrTrim) // Alpha test options
        : text;

    if (newText !== text) {
        DiffMap.set(line, [text, newText]);
    }

    const endCharacter: number = Math.max(newText.length, textRaw.length);
    const range = new vscode.Range(line, 0, line, endCharacter);
    return new vscode.TextEdit(range, newText);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function fn_Warn_thisLineText_WARN(args: TWarnUse, AhkTokenLine: TAhkTokenLine): vscode.TextEdit {
    const {
        lStrTrim,
        occ,
        bracketsDeep,
        options, // by self
        switchDeep,
        topLabelDeep,
    } = args;
    const {
        multiline,
        multilineFlag,
        textRaw,
        cll,
    } = AhkTokenLine;
    if (multilineFlag !== null && multilineFlag.LTrim.length === 0) {
        return wrap(args, textRaw, AhkTokenLine); // in multi-line and not open LTrim flag
    }

    const WarnLineBodyWarn: string = textRaw.trimStart();
    if (WarnLineBodyWarn === '') {
        return wrap(args, '', AhkTokenLine);
    }

    const LineDeep: 0 | 1 = (occ === 0 && lStrTrim !== '') // AhkTokenLine.cll Include `;`
        ? cll
        : 0;

    /**
     * 1. case1
     *     ```ahk
     *     fn(){
     *         return
     *     } ;<------- need -1
     *
     * 2. case2
     *    ```ahk
     *     if (bbb === ccc)
     *     { ; <------ need -1
     *
     *     }
     *     ```
     */
    const curlyBracketsChange: -1 | 0 = lStrTrim.startsWith('}') || (occ > 0 && lStrTrim.startsWith('{'))
        ? -1
        : 0;

    const lTrimDeep: 0 | 1 = getDeepLTrim(multiline, multilineFlag);
    const deepFix = Math.max(
        0,
        occ
            + curlyBracketsChange
            + LineDeep
            + switchDeep
            + lTrimDeep
            + topLabelDeep
            + bracketsDeep,
    );

    const { insertSpaces, tabSize } = options;
    const TabSpaces: ' ' | '\t' = insertSpaces
        ? ' '
        : '\t';

    const TabSize: number = insertSpaces
        ? tabSize
        : 1;

    const DeepStr = TabSpaces.repeat(deepFix * TabSize);
    return wrap(args, `${DeepStr}${WarnLineBodyWarn}`, AhkTokenLine);
}
