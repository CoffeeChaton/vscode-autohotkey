export function inCommentBlock(textRaw: string, CommentBlock: boolean): boolean {
    if (CommentBlock) {
        if (
            textRaw.indexOf('*/') > -1
            && (/^\s*\*\//u).test(textRaw)
        ) {
            return false;
        }
    } else if (
        textRaw.indexOf('/*') > -1
        && (/^\s*\/\*/u).test(textRaw)
    ) {
        return true;
    }
    return CommentBlock;
}
