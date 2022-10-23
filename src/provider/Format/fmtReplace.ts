import { EDetail, EMultiline } from '../../globalEnum';

function textReplace(textElement: string): string {
    return textElement.replaceAll(/ *, */gu, ', ')
        .replaceAll(/ *:= */ug, ' := ')
        .replaceAll(/ *!= */ug, ' != ')
        // .replaceAll(/ *== */g, ' == ') test err
        // .replaceAll(/ *>= */g, ' >= ') test err
        // .replaceAll(/ *<= */g, ' <= ') test err
        .replaceAll(/ *\.= */ug, ' .= ')
        .replaceAll(/ *\+= */ug, ' += ')
        .replaceAll(/ *-= */ug, ' -= ')
        .replaceAll(/ *\|\| */ug, ' || ')
        .replaceAll(/ *&& */ug, ' && ')
        .replaceAll(/ *<> */ug, ' <> ')
        .replaceAll(/\breturn\s+/ug, 'return ')
        .replaceAll(/\bReturn\s+/ug, 'Return ')
        // .replaceAll(/ *\? */g, ' ? ')
        .replaceAll(/\( */ug, '(')
        .replaceAll(/ *\)/ug, ')')
        .replaceAll(/\[ */ug, '[')
        .replaceAll(/ *\]/ug, ']')
        // .replaceAll(/ *\{ */ug, ' {')
        // .replaceAll(/ *\}/ug, '}')
        // .replaceAll(/\}\s+/ug, '} ')
        .replaceAll(/\)\s*\{ */ug, ') {')
        .replaceAll(/\bif\s*\(/ug, 'if (')
        .replaceAll(/\bIf\s*\(/ug, 'If (')
        .replaceAll(/\bIF\s*\(/ug, 'IF (')
        .replaceAll(/\bwhile\s*\(/ug, 'while (')
        .replaceAll(/\bWhile\s*\(/ug, 'While (')
        .replaceAll(/\bWHILE\s*\(/ug, 'WHILE (')
        .replaceAll(/ *;/ug, ' ;');

    // \s === [ \f\n\r\t\v]
    // need more TEST & options
}

function fnLR(strElement: string): string {
    const LR = strElement.indexOf(';');
    if (LR === -1) return textReplace(strElement);
    if (LR === 0) return strElement;
    if (LR > 0) {
        const Left = strElement.slice(0, LR + 1);
        const Right = strElement.slice(LR + 1, strElement.length); // || '';
        return textReplace(Left) + Right;
    }
    return strElement;
}

function fnStrGroup(text: string): string {
    const headInt = text.search(/\S/u);

    const head = (headInt > 0)
        ? text.slice(0, headInt)
        : '';

    const body = (headInt >= 0)
        ? text.slice(headInt)
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

export function lineReplace({
    text,
    lStrTrim,
    detail,
    multiline,
}: { text: string; lStrTrim: string; detail: readonly EDetail[]; multiline: EMultiline }): string {
    return (lStrTrim === ''
            || detail.includes(EDetail.inSkipSign2)
            || detail.includes(EDetail.inComment)
            || multiline !== EMultiline.none
            || lStrTrim.startsWith(':') || lStrTrim.includes('::'))
        ? text
        : fnStrGroup(text);
}
