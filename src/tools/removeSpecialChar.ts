
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
// eslint-disable-next-line max-statements
export function getSkipSign(text: string): boolean {
  // https://www.autohotkey.com/docs/Scripts.htm#continuation
  const skipList: RegExp[] = [
    /^;/,
    /^if\b/,
    /^while\b/,
    /^else\b/,
    /^sleep\b/,
    /^msgbox\b/,
    /^gui\b/,
  ];

  const textFix = text.trim().toLowerCase();
  for (let i = 0; i < skipList.length; i += 1) {
    if (textFix.search(skipList[i]) !== -1) return true;
  }

  return false;
}

export function removeSpecialChar(text: string, NotStr: boolean): string {
  let textFix = text;
  if (textFix.trim() === '') return '';

  const searchEC: RegExp = /`\S/g;
  textFix = textFix.replace(searchEC, '');
  if (NotStr) {
    const searchDQM: RegExp = /"([^"]*)"/g; // Double quotation marks
    const searchSQM: RegExp = /'([^']*)'/g; // Single quotation marks
    textFix = textFix.replace(searchDQM, ''); // remove ""
    textFix = textFix.replace(searchSQM, ''); // remove ''
  }
  const comment = textFix.indexOf(';');
  if (comment > -1) {
    textFix = textFix.substring(0, comment);
  }

  return textFix;
}
