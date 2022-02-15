/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,100] }] */
import { getSkipSign, getSkipSign2 } from '../../tools/removeSpecialChar';

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
