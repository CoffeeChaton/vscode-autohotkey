import * as vscode from 'vscode';
import { getFormatConfig } from '../../configUI';
import type { DeepReadonly, EMultiline, TMultilineFlag } from '../../globalEnum';
import { EDetail } from '../../globalEnum';
import { ContinueLongLine } from './ContinueLongLine';
import { lineReplace } from './fmtReplace';
import { getDeepLTrim } from './getDeepLTrim';
import { inSwitchBlock } from './SwitchCase';
import type { TDiffMap } from './TFormat';

type TWarnUse =
    & DeepReadonly<{
        detail: readonly EDetail[];
        textFix: string;
        line: number;
        occ: number;
        deep: number;
        multiline: EMultiline;
        multilineFlag: TMultilineFlag;
        textRaw: string;
        switchRangeArray: vscode.Range[];
        document: vscode.TextDocument;
        options: vscode.FormattingOptions;
    }>
    & {
        DiffMap: TDiffMap;
    };

function wrap(args: TWarnUse, text: string): vscode.TextEdit {
    const {
        detail,
        textFix,
        line,
        multiline,
        textRaw,
        DiffMap,
    } = args;

    const CommentBlock: boolean = detail.includes(EDetail.inComment);
    const newText: string = getFormatConfig() // WTF
        ? lineReplace(text, textFix, CommentBlock, multiline)
        : text;

    if (newText !== text) {
        DiffMap.set(line, [text, newText]);
    }

    const endCharacter: number = Math.max(newText.length, textRaw.length);
    const range = new vscode.Range(line, 0, line, endCharacter);
    return new vscode.TextEdit(range, newText);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function fn_Warn_thisLineText_WARN(args: TWarnUse): vscode.TextEdit {
    const {
        textFix,
        line,
        occ,
        deep,
        multiline,
        multilineFlag,
        switchRangeArray,
        document,
        options, // by self
    } = args;

    if (multilineFlag !== null && multilineFlag.LTrim.length === 0) {
        return wrap(args, document.lineAt(line).text); // WTF**********
    }

    // const WarnLineBodyWarn: string = textRaw.replace(/\r$/u, '').trimStart();
    const WarnLineBodyWarn: string = document.lineAt(line).text.trimStart();
    if (WarnLineBodyWarn === '') {
        return wrap(args, WarnLineBodyWarn);
    }

    const switchDeep = inSwitchBlock(textFix, line, switchRangeArray);
    const LineDeep: 0 | 1 = (occ !== 0)
        ? 0
        : ContinueLongLine(textFix);

    const curlyBracketsChange: -1 | 0 = textFix.startsWith('}') || (occ > 0 && textFix.startsWith('{'))
        ? -1
        : 0;

    const deepFix = Math.max(
        0,
        deep + occ + curlyBracketsChange + LineDeep + switchDeep + getDeepLTrim(multiline, multilineFlag),
    );

    const TabSpaces = options.insertSpaces
        ? ' '
        : '\t';

    const TabSize = options.insertSpaces
        ? options.tabSize
        : 1;

    const DeepStr = TabSpaces.repeat(deepFix * TabSize);
    return wrap(args, `${DeepStr}${WarnLineBodyWarn}`);
}
