
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
const skipList: RegExp[] = [
    /^;/,
    /^sleep\b/,
    /^msgbox\b/,
    /^gui\b/,
    /^send(?:Raw|Input|Play|Event)?\b/,
    /^[\w%[\]]+\s*=/, // TraditionAssignment
];
const iMax = skipList.length;
export function getSkipSign(text: string): boolean {
    const textFix = text.trim().toLowerCase();
    for (let i = 0; i < iMax; i += 1) {
        if (textFix.search(skipList[i]) !== -1) return true;
    }
    return false;
}

export function removeSpecialChar(text: string): string {
    const searchEC = /`./g;

    let textFix = text;
    if (textFix.trim() === '') return '';
    textFix = textFix.replace(searchEC, ' ');

    const comment = textFix.indexOf(';');
    if (comment > -1) {
        textFix = textFix.substring(0, comment);
    }

    return textFix;
}
export function removeSpecialChar2(text: string): string {
    let textFix = text;
    if (textFix.trim() === '') return '';

    const searchEC = /`./g;
    const searchDQM = /"([^"]*)"/g; // Double quotation marks
    const searchSQM = /'([^']*)'/g; // Single quotation marks

    textFix = textFix.replace(searchEC, ' ');
    textFix = textFix.replace(searchDQM, ''); // remove ""
    textFix = textFix.replace(searchSQM, ''); // remove ''

    const comment = textFix.indexOf(';');
    if (comment > -1) {
        textFix = textFix.substring(0, comment);
    }

    return textFix;
}
