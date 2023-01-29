import * as vscode from 'vscode';
import type { DeepReadonly, TAhkTokenLine } from '../../globalEnum';

import { ContinueLongLine } from './ContinueLongLine';
import { lineReplace } from './fmtReplace';
import { getDeepLTrim } from './getDeepLTrim';
import { inSwitchBlock } from './SwitchCase';
import type { TDiffMap } from './TFormat';

export type TEndOfLine = '\n' | '\r\n';

type TWarnUse =
    & DeepReadonly<{
        endOfLine: TEndOfLine,
        lStrTrim: string,
        occ: number,
        oldDeep: number,
        options: vscode.FormattingOptions,
        switchRangeArray: vscode.Range[],
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
        endOfLine,
        lStrTrim,
        occ,
        oldDeep,
        options, // by self
        switchRangeArray,
        topLabelDeep,
    } = args;
    const {
        line,
        multiline,
        multilineFlag,
        textRaw,
    } = AhkTokenLine;
    if (multilineFlag !== null && multilineFlag.LTrim.length === 0) {
        return wrap(args, textRaw + endOfLine, AhkTokenLine); // WTF**********
    }

    // const WarnLineBodyWarn: string = textRaw.replace(/\r$/u, '').trimStart();
    const WarnLineBodyWarn: string = textRaw.trimStart();
    if (WarnLineBodyWarn === '') {
        return wrap(args, WarnLineBodyWarn, AhkTokenLine);
    }

    const switchDeep = inSwitchBlock(lStrTrim, line, switchRangeArray);
    const LineDeep: 0 | 1 = (occ === 0)
        ? ContinueLongLine(lStrTrim)
        : 0;

    const curlyBracketsChange: -1 | 0 = lStrTrim.startsWith('}') || (occ > 0 && lStrTrim.startsWith('{'))
        ? -1
        : 0;

    const deepFix = Math.max(
        0,
        oldDeep + occ + curlyBracketsChange + LineDeep + switchDeep + getDeepLTrim(multiline, multilineFlag)
            + topLabelDeep,
    );

    const TabSpaces = options.insertSpaces
        ? ' '
        : '\t';

    const TabSize = options.insertSpaces
        ? options.tabSize
        : 1;

    const DeepStr = TabSpaces.repeat(deepFix * TabSize);
    return wrap(args, `${DeepStr}${WarnLineBodyWarn}`, AhkTokenLine);
}
