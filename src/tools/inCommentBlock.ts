export default function (text: string, CommentBlock: boolean): boolean {
  const textFix = text.trim();
  const NotFind = -1;
  const CommentBlockStart = /^\s*\/\*/; //    /*
  if (textFix.search(CommentBlockStart) > NotFind) return true;
  const CommentBlockEnd = /^\s*\*\//;//  CommentBlock end  */
  if (textFix.search(CommentBlockEnd) > NotFind) return false;
  return CommentBlock;
}
