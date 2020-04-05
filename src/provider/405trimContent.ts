
// eslint-disable-next-line max-statements
function notStrInTextString(text: string, NotStr: boolean) {
  const searchDQM: RegExp = /"([^"]*)"/g; // Double quotation marks
  const searchSQM: RegExp = /'([^']*)'/g; // Single quotation marks
  const searchEC: RegExp = /`\S/g;
  const NotFind = -1;
  const subStart = 0;
  let textFix = text;

  // const EscapeChar = textFix.search(searchEC); // EscapeChar
  textFix = textFix.replace(searchEC, '');

  if (NotStr) {
    // 移除括號內文字 ""
    textFix = textFix.replace(searchDQM, '');

    // 移除括號內文字 ''
    textFix = textFix.replace(searchSQM, '');
  }
  const comment = textFix.indexOf(';');
  if (comment > NotFind) {
    textFix = textFix.substring(subStart, comment);
  }

  return textFix;
}
function CommandLine(text: string): boolean {
  const matchList: RegExp[] = [
    /^;/,
    /^msgbox[\s|,]/i,
    /^gui[\s|,]/i,
    //  /^win\w\w\w\w*[\s,]/i, // TODO WinWait https://wyagd001.github.io/zh-cn/docs/commands/WinWait.htm
    //  /^control[\s,]/i, // Control, https://wyagd001.github.io/zh-cn/docs/commands/Control.htm
  ];
  const step = 1;
  const arrayZero = 0;
  const searchNotFind = -1;
  const textFix = text.trim();
  for (let i = arrayZero; i < matchList.length; i += step) {
    const BlockSymbol = textFix.search(matchList[i]);
    //  if (BlockSymbol > searchNotFind) console.log(`BlockSymbol ${BlockSymbol}`);
    if (BlockSymbol > searchNotFind) return true;
  }

  return false;
}
export default function trimContent(text: string, NotStr: boolean): string { // FIXME
  let textFix = text;
  if (textFix.trim() === '') return '';
  const isCommandLine = CommandLine(text); // ^; ^gui | ^msgbox
  if (isCommandLine) return '';

  textFix = notStrInTextString(textFix, NotStr);

  return textFix;
}
