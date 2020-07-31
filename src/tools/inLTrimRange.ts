/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2] }] */
import { removeSpecialChar2 } from './removeSpecialChar';

export function inLTrimRange(textRaw: string, LTrim: 0 | 1 | 2): 0 | 1 | 2 {
    const textTrim = textRaw.trimStart();
    if (textTrim.startsWith(')')) return 0;
    if (textTrim.startsWith('(')) {
        return (/\bltrim\bi/).test(removeSpecialChar2(textTrim)) ? 2 : 1;
    }
    return LTrim;
}
