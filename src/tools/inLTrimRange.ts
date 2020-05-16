export function inLTrimRange(textFix: string, LTrim: boolean): boolean {
    // FIXME *1 const textFix = removeSpecialChar2(textRaw.trim().toLowerCase());
    if (textFix.startsWith(')')) return false;
    if (textFix.startsWith('(') && !(/\bltrim\b/i).test(textFix)) return true;

    return LTrim;
}
