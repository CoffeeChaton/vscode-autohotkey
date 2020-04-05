export default function (text: string, CommentBlock: boolean): boolean {
  const NotFind = -1;
  const CommentBlockStart = /^\s*\/\*/; //    /*
  if (text.search(CommentBlockStart) > NotFind) return true;
  const CommentBlockEnd = /^\s*\*\//;//  CommentBlock end  */
  if (text.search(CommentBlockEnd) > NotFind) return false;
  return CommentBlock;
}
