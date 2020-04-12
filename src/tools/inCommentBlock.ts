const CommentBlockStart = /^\s*\/\*/; //    /*
const CommentBlockEnd = /^\s*\*\//;//  CommentBlock end  */

export default function (text: string, CommentBlock: boolean): boolean {
    const textFix = text.trim();
    const NotFind = -1;
    if (textFix.search(CommentBlockStart) > NotFind) return true;
    if (textFix.search(CommentBlockEnd) > NotFind) return false;
    return CommentBlock;
}
