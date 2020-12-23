/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,100] }] */
import * as vscode from 'vscode';
import { inCommentBlock } from '../../tools/inCommentBlock';
import { inLTrimRange } from '../../tools/inLTrimRange';
import { getLStr, getSkipSign, getSkipSign2 } from '../../tools/removeSpecialChar';
import { callDiff, DiffType } from '../../tools/Diff';
import { VERSION } from '../../globalEnum';

function showWarn(timeStart: number): void {
    const time = Date.now() - timeStart;
    vscode.window.showInformationMessage(`Format Selection is ${VERSION.formatRange}, ${time}ms`);
}
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
        .replace(/\breturn\s\s*/g, 'return ')
        .replace(/\bReturn\s\s*/g, 'Return ')
        // .replace(/ *\? */g, ' ? ')
        .replace(/\( */g, '(')
        .replace(/ *\)/g, ')')
        .replace(/\[ */g, '[')
        .replace(/ *]/g, ']')
        .replace(/ *{ */g, ' {')
        .replace(/ *}/g, '}')
        .replace(/}\s\s*/g, '} ') // TODO WTF double \s ?
        .replace(/\)\s*{ */g, ') {')
        .replace(/\bif\s*\(/g, 'if (')
        .replace(/\bIf\s*\(/g, 'If (')
        .replace(/\bIF\s*\(/g, 'IF (')
        .replace(/\bwhile\s*\(/g, 'while (')
        .replace(/\bWhile\s*\(/g, 'While (')
        .replace(/\bWHILE\s*\(/g, 'WHILE (')
        .replace(/ *;/g, ' ;');// TODO options of ";"
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
        newBody += ((s % 2) !== 0 || strElement.includes('`')) // TODO  strElement.includes('`')
            ? strElement
            : fnLR(strElement);
    }
    return head + newBody.trimStart();
}

type RangeFormatType = {
    timeStart: number;
    RangeTextRaw: string;
    RangeText: string;
    fsPath: string;
    range: vscode.Range;
};

export function lineReplace(text: string, textFix: string, CommentBlock: boolean, inLTrim: 0 | 1 | 2): string {
    return (CommentBlock || textFix === '' || inLTrim > 0 || getSkipSign(textFix)
        || getSkipSign2(textFix) || textFix.startsWith(':') || textFix.includes('::'))
        ? text
        : fnStrGroup(text);
}
export function RangeFormat({
    timeStart, RangeTextRaw, RangeText, fsPath, range,
}: RangeFormatType): vscode.ProviderResult<vscode.TextEdit[]> {
    let CommentBlock = false;
    let inLTrim: 0 | 1 | 2 = 0;
    let textNew = '';

    const textLineGroup = RangeText.split('\n');
    const lineMax = textLineGroup.length;
    for (let line = 0; line < lineMax; line += 1) {
        const text = textLineGroup[line];
        CommentBlock = inCommentBlock(text, CommentBlock);
        const textFix = getLStr(text).trim();
        inLTrim = inLTrimRange(textFix, inLTrim);

        textNew += (CommentBlock || textFix === '' || inLTrim > 0 || getSkipSign(textFix)
            || getSkipSign2(textFix) || textFix.startsWith(':') || textFix.includes('::'))
            ? text
            : fnStrGroup(text);

        textNew += (line < lineMax - 1)
            ? '\n'
            : '';
    }
    showWarn(timeStart);
    const diffVar: DiffType = {
        leftText: RangeTextRaw,
        right: textNew,
        fsPath,
    };
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(callDiff, 100, diffVar);

    return [
        new vscode.TextEdit(range, textNew),
    ];
}
export class RangeFormatProvider implements vscode.DocumentRangeFormattingEditProvider {
    public provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const RangeText = document.getText(range);
        const timeStart = Date.now();
        return RangeFormat({
            timeStart, RangeTextRaw: RangeText, RangeText, fsPath: document.uri.fsPath, range,
        });
    }
}
