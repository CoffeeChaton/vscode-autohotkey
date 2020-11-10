export function getCommentOfLine({ textRaw, lStr }: { textRaw: string; lStr: string; }): string | '' {
    let comment = '';
    if (lStr.length < textRaw.length) {
        const col = textRaw.indexOf(';', lStr.length);
        if (col > -1) comment = textRaw.substring(col + 1, textRaw.length);
    }
    return comment;
}
