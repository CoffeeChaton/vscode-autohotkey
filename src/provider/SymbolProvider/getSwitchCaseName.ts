export function getCaseName(textRaw: string, lStr: string): null | string {
    const caseS = lStr.search(/\bcase[\s,]/ui);
    if (caseS === -1) return null;

    const caseE = lStr.indexOf(':');
    if (caseE === -1) return null;

    // eslint-disable-next-line no-magic-numbers
    return `Case ${textRaw.substring(caseS + 4, caseE).trim()}:`;
}

export function getSwitchName(textRaw: string): string {
    return textRaw.replace(/^\s*\bswitch\b\s*/ui, '')
        .replace(/\{\s*$/u, '')
        .trim(); // ahk allow switchName === ''
}
