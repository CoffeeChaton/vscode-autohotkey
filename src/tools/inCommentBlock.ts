export function inCommentBlock(text: string, CommentBlock: boolean): boolean {
    const textFix = text.trimStart();
    if (textFix.startsWith('/*')) return true;
    if (textFix.startsWith('*/')) return false;
    return CommentBlock;
}
