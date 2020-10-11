export function getCaseDefaultName(textRaw: string, lStr: string): false | string {
    const isDefault = (/^\s*default\b\s*:/i).test(lStr);
    if (isDefault) return 'Default :';

    if ((/^\s*\bcase\b/i).test(lStr) === false) return false;

    const caseS = lStr.search(/\bcase\b/i);
    if (caseS === -1) return false;

    const caseE = lStr.indexOf(':');
    if (caseE === -1) return false;

    // eslint-disable-next-line no-magic-numbers
    return `Case ${textRaw.substring(caseS + 4, caseE + 1).trim()}`;
}

export function getSwitchName(textRaw: string): string {
    return textRaw.replace(/^\s*switch\b\s*/i, '').replace(/\{\s*$/, '').trim();
}
