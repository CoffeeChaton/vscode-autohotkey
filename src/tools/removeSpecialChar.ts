
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */


export function getSkipSign(text: string): boolean {
    const skipList: RegExp[] = [
        /^;/,
        // /^if\b/,
        // /^while\b/,
        // /^else\b/,
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

export function removeSpecialChar(text: string): string {
    const searchEC: RegExp = /`./g;

    let textFix = text;
    if (textFix.trim() === '') return '';
    textFix = textFix.replace(searchEC, '');

    const comment = textFix.indexOf(';');
    if (comment > -1) {
        textFix = textFix.substring(0, comment);
    }

    return textFix;
}
export function removeSpecialChar2(text: string): string {
    const searchEC: RegExp = /`./g;
    const searchDQM: RegExp = /"([^"]*)"/g; // Double quotation marks
    const searchSQM: RegExp = /'([^']*)'/g; // Single quotation marks

    let textFix = text;
    if (textFix.trim() === '') return '';
    textFix = textFix.replace(searchEC, '');

    textFix = textFix.replace(searchDQM, ''); // remove ""
    textFix = textFix.replace(searchSQM, ''); // remove ''

    const comment = textFix.indexOf(';');
    if (comment > -1) {
        textFix = textFix.substring(0, comment);
    }

    return textFix;
}
