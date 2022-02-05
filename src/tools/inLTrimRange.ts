/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2] }] */
import { getLStr } from './removeSpecialChar';

export function inLTrimRange(textRaw: string, LTrim: 0 | 1 | 2): 0 | 1 | 2 {
    if (LTrim) {
        if ((/^\s*\)/).test(textRaw)) return 0;
    } else if ((/^\s*\(/).test(textRaw)) {
        return (/\bltrim\b/i).test(getLStr(textRaw))
            ? 2
            : 1;
    }
    return LTrim;
}
