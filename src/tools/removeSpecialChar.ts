/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */

export function getSkipSign(text: string): boolean {
    const skipList: RegExp[] = [
        //   /^\s*;/,
        // /^sleep\b/i,
        /^\s*msgbox\b/i,
        //  /^gui\b/i,
        //  /^send(?:raw|input|play|event)?[,\s]/i,
        /^\s*sendRaw\b/i,
        /^\s*send\b\s*{Raw}/i,
        //  /^\s*::/,
        //  /^menu[,\s]/i,
        //   /^s*loop[,\s][,\s]*parse,/,
        /^\s*[\w%[][\w%[\]]*\s*=[^=]/, // TraditionAssignment
        // [^+\--:=><*!/\w~)"]=[^=]
    ];
    const iMax = skipList.length;
    for (let i = 0; i < iMax; i += 1) {
        if (skipList[i].test(text)) return true;
    }
    return false;
}

function removeComment(text: string): string {
    const i = text.indexOf(';');
    switch (i) {
        case -1:
            return text;
        case 0:
            return '';
        default:
            return text.substring(0, i);
    }
}

function fnReplacer(match: string, p1: string): string {
    return '_'.repeat(p1.length);
}

export function removeSpecialChar(text: string): string {
    return text.trim() === ''
        ? ''
        : removeComment(text.replace(/`./g, '__'));
}

export function removeSpecialChar2(text: string): string {
    return text.trim() === ''
        ? ''
        : removeComment(text.replace(/`./g, '__').replace(/"([^"]*?)"/g, fnReplacer)); // Double quotation marks
}
