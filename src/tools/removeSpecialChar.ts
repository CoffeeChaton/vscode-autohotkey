/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */

export function getSkipSign(text: string): boolean {
    const skipList: RegExp[] = [
        /^s*;/,
        /^s*sleep\b/i,
        /^s*msgbox\b/i,
        /^s*gui\b/i,
        /^s*send(?:raw|input|play|event)?[,\s]/i,
        /^s*menu[,\s]/i,
        //   /^s*loop[,\s][,\s]*parse,/,
        /^s*[\w%[\]][\w%[\]]*\s*=[^=]/, // TraditionAssignment
    ];
    const iMax = skipList.length;
    for (let i = 0; i < iMax; i += 1) {
        if (skipList[i].test(text)) return true;
        //    if (textFix.search(skipList[i]) > -1) return true;
    }
    return false;
}

function removeComment(text: string): string {
    const len = text.length;
    for (let i = 0; i < len; i++) {
        if (text[i] === ';') return text.substring(0, i);
    }
    return text;
}

function fnReplacer(match: string, p1: string): string {
    return ' '.repeat(p1.length);
}

export function removeSpecialChar(text: string): string {
    if (text.trim() === '') return '';
    return removeComment(text.replace(/`./g, '  '));
}

export function removeSpecialChar2(text: string): string {
    if (text.trim() === '') return '';
    return removeComment(text.replace(/`./g, '  ').replace(/"([^"]*)"/g, fnReplacer)); // Double quotation marks
}
