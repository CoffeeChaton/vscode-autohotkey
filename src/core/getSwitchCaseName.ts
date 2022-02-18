export function getCaseDefaultName(textRaw: string, lStr: string): false | string {
    //  isDefault
    if ((/^\s*\bdefault\b\s*:/i).test(lStr)) return 'Default :';

    if (!(/^\s*\bcase\b[\s,]/i).test(lStr)) return false;

    const caseS = lStr.search(/\scase[\s,]/i);
    if (caseS === -1) return false;

    const caseE = lStr.indexOf(':');
    if (caseE === -1) return false;

    // eslint-disable-next-line no-magic-numbers
    return `Case ${textRaw.substring(caseS + 4, caseE + 1).trim()}`;
}

export function getSwitchName(textRaw: string): string {
    return textRaw.replace(/^\s*\bswitch\b\s*/i, '')
        .replace(/{\s*$/, '')
        .trim() || '!!not find Switch Name';
}
