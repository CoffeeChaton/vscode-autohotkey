export function getCommentOfLine({ textRaw, lStr }: { textRaw: string; lStr: string }): string | null {
    if (textRaw.length > lStr.length) {
        const comment = textRaw.substring(lStr.length, textRaw.length);
        if (comment.startsWith(';;')) {
            return comment.replace(/^;;/, '');
        }
    }
    return null;
}
