/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,100] }] */
import * as vscode from 'vscode';
import { TFormatChannel } from '../../globalEnum';
import { callDiff, DiffType } from '../../tools/Diff';
import { inCommentBlock } from '../../tools/inCommentBlock';
import { inLTrimRange } from '../../tools/inLTrimRange';
import { getLStr, getSkipSign, getSkipSign2 } from '../../tools/removeSpecialChar';
import { fmtReplaceWarn } from './fmtReplaceWarn';

function textReplace(textElement: string): string {
    return textElement.replace(/ *, */g, ', ')
        .replace(/ *:= */g, ' := ')
        .replace(/ *!= */g, ' != ')
        // .replace(/ *== */g, ' == ') test err
        // .replace(/ *>= */g, ' >= ') test err
        // .replace(/ *<= */g, ' <= ') test err
        // TODO .replace(/ *== */g, ' == ')
        .replace(/ *\.= */g, ' .= ')
        .replace(/ *\+= */g, ' += ')
        .replace(/ *-= */g, ' -= ')
        .replace(/ *\|\| */g, ' || ')
        .replace(/ *&& */g, ' && ')
        .replace(/ *<> */g, ' <> ')
        .replace(/\breturn\s+/g, 'return ')
        .replace(/\bReturn\s+/g, 'Return ')
        // .replace(/ *\? */g, ' ? ')
        .replace(/\( */g, '(')
        .replace(/ *\)/g, ')')
        .replace(/\[ */g, '[')
        .replace(/ *]/g, ']')
        .replace(/ *{ */g, ' {')
        .replace(/ *}/g, '}')
        .replace(/}\s+/g, '} ')
        .replace(/\)\s*{ */g, ') {')
        .replace(/\bif\s*\(/g, 'if (')
        .replace(/\bIf\s*\(/g, 'If (')
        .replace(/\bIF\s*\(/g, 'IF (')
        .replace(/\bwhile\s*\(/g, 'while (')
        .replace(/\bWhile\s*\(/g, 'While (')
        .replace(/\bWHILE\s*\(/g, 'WHILE (')
        .replace(/ *;/g, ' ;');
    // \s === [ \f\n\r\t\v]
    // TODO more TEST & options
}

function fnLR(strElement: string): string {
    const LR = strElement.indexOf(';');
    if (LR === -1) return textReplace(strElement);
    if (LR === 0) return strElement;
    if (LR > 0) {
        const Left = strElement.substring(0, LR + 1);
        const Right = strElement.substring(LR + 1, strElement.length) || '';
        return textReplace(Left) + Right;
    }
    return strElement;
}

function fnStrGroup(text: string): string {
    const headInt = text.search(/\S/);

    const head = (headInt > 0)
        ? text.substring(0, headInt)
        : '';

    const body = (headInt >= 0)
        ? text.substring(headInt)
        : text;

    const strGroup = body.split('"');
    const sMax = strGroup.length;
    let newBody = '';
    for (let s = 0; s < sMax; s++) {
        newBody += (s > 0 && s < sMax)
            ? '"'
            : '';

        const strElement = strGroup[s];
        newBody += ((s % 2) !== 0 || strElement.includes('`'))
            ? strElement
            : fnLR(strElement);
    }
    return head + newBody.trimStart();
}

export function lineReplace(text: string, textFix: string, CommentBlock: boolean, inLTrim: 0 | 1 | 2): string {
    return (CommentBlock || textFix === '' || inLTrim > 0 || getSkipSign(textFix)
            || getSkipSign2(textFix) || textFix.startsWith(':') || textFix.includes('::'))
        ? text
        : fnStrGroup(text);
}

type RangeFormatType = {
    timeStart: number;
    RangeTextRaw: string;
    RangeText: string;
    fsPath: string;
    range: vscode.Range;
    options: vscode.FormattingOptions;
};

export function FormatNextVersion({
    timeStart,
    RangeTextRaw,
    RangeText,
    fsPath,
    range,
}: RangeFormatType): vscode.ProviderResult<vscode.TextEdit[]> {
    let CommentBlock = false;
    let inLTrim: 0 | 1 | 2 = 0;
    let textNew = '';

    const textLineGroup = RangeText.split('\n');
    const lineMax = textLineGroup.length;
    for (let line = 0; line < lineMax; line++) {
        const text = textLineGroup[line];
        CommentBlock = inCommentBlock(text, CommentBlock);
        const textFix = getLStr(text).trim();
        inLTrim = inLTrimRange(textFix, inLTrim);

        const textNewBoolean: boolean = (CommentBlock || textFix === '' || inLTrim > 0 || getSkipSign(textFix)
            || getSkipSign2(textFix) || textFix.startsWith(':') || textFix.includes('::'));

        textNew += textNewBoolean
            ? text
            : fnStrGroup(text);

        textNew += (line < lineMax - 1)
            ? '\n'
            : '';
    }
    fmtReplaceWarn(timeStart, TFormatChannel.byDev);
    const diffVar: DiffType = {
        leftText: RangeTextRaw,
        right: textNew,
        fsPath,
    };
    setTimeout(callDiff, 100, diffVar);

    return [
        new vscode.TextEdit(range, textNew),
    ];
}
// return FormatReplace({
//     timeStart,
//     RangeTextRaw: RangeText,
//     RangeText,
//     fsPath: document.uri.fsPath,
//     range,
//     options,
// });
