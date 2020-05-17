
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
export function getSkipSign(text: string): boolean {
    const skipList: RegExp[] = [
        /^;/,
        /^sleep\b/,
        /^msgbox\b/,
        /^gui\b/,
        /^send(?:raw|input|play|event)?\b/,
        /^[\w%[\]][\w%[\]]*\s*=/, // TraditionAssignment
    ];
    const iMax = skipList.length;
    const textFix = text.trim().toLowerCase();
    for (let i = 0; i < iMax; i += 1) {
        if (skipList[i].test(textFix)) return true;
    }
    return false;
}

export function removeSpecialChar(text: string): string {
    let textFix = text;
    if (textFix.trim() === '') return '';
    const searchEC = /`./g;
    textFix = textFix.replace(searchEC, ' ');

    const comment = textFix.indexOf(';');
    if (comment > -1) textFix = textFix.substring(0, comment);

    return textFix;
}
export function removeSpecialChar2(text: string): string {
    let textFix = text;
    if (textFix.trim() === '') return '';

    const searchEC = /`./g;
    const searchDQM = /"([^"]*)"/g; // Double quotation marks
    textFix = textFix.replace(searchEC, ' ')
        .replace(searchDQM, ''); // remove ""

    const comment = textFix.indexOf(';');
    if (comment > -1) textFix = textFix.substring(0, comment);

    return textFix;
}
