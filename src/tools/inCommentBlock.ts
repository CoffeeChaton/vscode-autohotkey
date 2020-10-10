export function inCommentBlock(textRaw: string, CommentBlock: boolean): boolean {
    if ((/^\s*\/\*/).test(textRaw)) return true;
    if ((/^\s*\*\//).test(textRaw)) return false;
    return CommentBlock;
}
