/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
export default function (text: string, CommentBlock: boolean): boolean {
    const CommentBlockStart = /^\/\*/; //    /*
    const CommentBlockEnd = /^\*\//;//  CommentBlock end  */
    const textFix = text.trim();
    if (textFix.search(CommentBlockStart) > -1) return true;
    if (textFix.search(CommentBlockEnd) > -1) return false;
    return CommentBlock;
}
