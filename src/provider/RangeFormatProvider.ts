/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */
import * as vscode from 'vscode';
import { inCommentBlock } from '../tools/inCommentBlock';
import { inLTrimRange } from '../tools/inLTrimRange';
import { removeSpecialChar2, getSkipSign } from '../tools/removeSpecialChar';
/*
TODO wait to fix /** / block
     wait to fix ^\s*,
ok
    ; block
}
*/
function textReplace(textElement: string): string {
    return textElement.replace(/ *, */g, ', ')
        .replace(/ *:= */g, ' := ')
        .replace(/ *!= */g, ' != ')
        // .replace(/ *== */g, ' == ') test err
        // .replace(/ *>= */g, ' >= ') test err
        // .replace(/ *<= */g, ' <= ') test err
        // TODO   .replace(/ *== */g, ' == ')
        .replace(/ *\.= */g, ' .= ')
        .replace(/ *\+= */g, ' += ')
        .replace(/ *-= */g, ' -= ')
        .replace(/ *\|\| */g, ' || ')
        .replace(/ *&& */g, ' && ')
        .replace(/ *<> */g, ' <> ')
        .replace(/\breturn  */g, 'return ')
        .replace(/\bReturn  */g, 'Return ') // return space+
        // .replace(/ *\? */g, ' ? ')
        .replace(/\( */g, '(') // space-in-parens
        .replace(/ *\)/g, ')') // space-in-parens
        .replace(/\[ */g, '[') // array-bracket-spacing
        .replace(/ *\]/g, ']') // array-bracket-spacing
        .replace(/ *\{ */g, ' {') // space-before-blocks
        .replace(/ *\}/g, '}') //  space-before-blocks
        .replace(/\} +/g, '} ')
        .replace(/\) *\{ */g, ') {') // ) {
        .replace(/\bif\(/g, 'if (') // space-after-keywords
        .replace(/\bIf\(/g, 'If (') // space-after-keywords
        .replace(/\bIF\(/g, 'IF (') // space-after-keywords
        .replace(/\bwhile\(/g, 'while (') // space-after-keywords
        .replace(/\bWhile\(/g, 'While (') // space-after-keywords
        .replace(/\bWHILE\(/g, 'WHILE (') // space-after-keywords
        .replace(/ *;/g, ' ;');// TODO options of ";"
    // \s === [ \f\n\r\t\v]
    // TODO more TEST & options
}
function fnLR(strElement: string): string {
    const LR = strElement.indexOf(';');
    let str = '';
    if (LR === 0) {
        str = strElement;
    } else if (LR === -1) {
        str = textReplace(strElement);
    } else if (LR > 0) {
        const Left = strElement.substring(0, LR + 1);
        const Right = strElement.substring(LR + 1, strElement.length) || '';
        str = textReplace(Left) + Right;
    }
    return str;
}

function fnStrGroup(text: string): string {
    const headInt = text.search(/\S/);
    const body = (headInt >= 0)
        ? text.substring(headInt)
        : '';
    const head = (headInt > 0)
        ? text.substring(0, headInt)
        : '';

    const strGroup = body.split('"');
    const sMax = strGroup.length;
    let newBody = '';
    for (let s = 0; s < sMax; s += 1) {
        const strElement = strGroup[s];
        if (s > 0 && s < sMax) {
            newBody += '"';
        }
        newBody += ((s % 2) !== 0 || strElement.includes('::') || strElement.includes('`'))
            ? strElement
            : fnLR(strElement);
    }
    return head + newBody;
}
let globalTime = Date.now();
function showWarn(timeStart: number): void {
    const min = 10000;
    if (globalTime - timeStart > min) {
        vscode.window.showInformationMessage(`Format Selection is Alpha 0.3, ${Date.now() - timeStart}ms`);
        globalTime = timeStart;
    }
}
export class RangeFormatProvider implements vscode.DocumentRangeFormattingEditProvider {
    // eslint-disable-next-line class-methods-use-this
    public provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TextEdit[]> {
        const timeStart = Date.now();
        let CommentBlock = false;
        let inLTrim: 0 | 1 | 2 = 0;
        let textNew = '';
        const textLineGroup = document.getText(range).split('\n');
        const lineMax = textLineGroup.length;
        for (let line = 0; line < lineMax; line += 1) {
            const text = textLineGroup[line];
            CommentBlock = inCommentBlock(text, CommentBlock);
            const textFix = removeSpecialChar2(text).trim();
            inLTrim = inLTrimRange(textFix, inLTrim);

            textNew += (CommentBlock || textFix === '' || getSkipSign(textFix) || inLTrim)
                ? text
                : fnStrGroup(text);

            textNew += (line < lineMax - 1)
                ? '\n'
                : '';
        }

        // TODO different DIFF
        const RangeText: vscode.TextEdit[] = [];
        RangeText.push(new vscode.TextEdit(range, textNew));
        showWarn(timeStart);
        return RangeText;
    }
}
