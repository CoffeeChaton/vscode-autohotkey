/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2] }] */

export function inLTrimRange(textTrimStart: string, LTrim: 0 | 1 | 2): 0 | 1 | 2 {
    if (LTrim !== 0) {
        if (textTrimStart.startsWith(')')) return 0;
    } else if (textTrimStart.startsWith('(')) {
        return (/^\(\s*\bLTrim\b/ui).test(textTrimStart)
            ? 2
            : 1;
    }
    return LTrim;
}
