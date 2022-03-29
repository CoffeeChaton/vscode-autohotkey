export function getCaseDefaultName(textRaw: string, lStr: string): null | string {
    //  isDefault
    if ((/^\s*\bdefault\b\s*:/iu).test(lStr)) return 'Default :';

    if (!(/^\s*\bcase\b[\s,]/ui).test(lStr)) return null;

    const caseS = lStr.search(/\bcase[\s,]/ui);
    if (caseS === -1) return null;

    const caseE = lStr.indexOf(':');
    if (caseE === -1) return null;

    // eslint-disable-next-line no-magic-numbers
    return `Case ${textRaw.substring(caseS + 4, caseE + 1).trim()}`;
}

export function getSwitchName(textRaw: string): string {
    return textRaw.replace(/^\s*\bswitch\b\s*/ui, '')
        .replace(/\{\s*$/u, '')
        .trim() || '!!not find Switch Name';
}
