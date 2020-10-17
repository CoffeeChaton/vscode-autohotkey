export function inCommentBlock(textRaw: string, CommentBlock: boolean): boolean {
    if (CommentBlock) {
        if ((/^\s*\*\//).test(textRaw)) return false;
    } else if ((/^\s*\/\*/).test(textRaw)) {
        return true;
    }
    return CommentBlock;
}
