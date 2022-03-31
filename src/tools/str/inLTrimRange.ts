/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2] }] */

import { getLStr } from './removeSpecialChar';

export function inLTrimRange(textTrimStart: string, LTrim: 0 | 1 | 2): 0 | 1 | 2 {
    if (LTrim !== 0) {
        if (textTrimStart.startsWith(')')) return 0;
    } else if (textTrimStart.startsWith('(')) {
        return (/\bLTrim\b/ui).test(getLStr(textTrimStart))
            ? 2
            : 1;
    }
    return LTrim;
}
