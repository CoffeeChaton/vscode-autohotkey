
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
// eslint-disable-next-line max-statements
function notStrInTextString(text: string, NotStr: boolean) {
  const searchDQM: RegExp = /"([^"]*)"/g; // Double quotation marks
  const searchSQM: RegExp = /'([^']*)'/g; // Single quotation marks
  const searchEC: RegExp = /`\S/g;
  let textFix = text;

  textFix = textFix.replace(searchEC, '');
  if (NotStr) {
    textFix = textFix.replace(searchDQM, ''); // remove ""
    textFix = textFix.replace(searchSQM, ''); // remove ''
  }
  const comment = textFix.indexOf(';');
  if (comment > -1) {
    textFix = textFix.substring(0, comment);
  }

  return textFix;
}
export function getSkipSign(text: string): boolean {
  // https://www.autohotkey.com/docs/Scripts.htm#continuation
  const skipList: RegExp[] = [
    /^;/,
    /^if\b/,
    /^while\b/,
    /^else\b/,
    /^sleep\b/,
    /^msgbox[\s|,]/,
    /^gui[\s|,]/,
    /^gui[\s|,]/,
  ];

  const textFix = text.trim().toLowerCase();
  for (let i = 0; i < skipList.length; i += 1) {
    if (textFix.search(skipList[i]) !== -1) return true;
  }

  return false;
}

export function trimContent(text: string, NotStr: boolean): string {
  let textFix = text;
  if (textFix.trim() === '') return '';

  textFix = notStrInTextString(textFix, NotStr);

  return textFix;
}
