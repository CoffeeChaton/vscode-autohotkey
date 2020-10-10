/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2] }] */
import { getLStr } from './removeSpecialChar';

export function inLTrimRange(textRaw: string, LTrim: 0 | 1 | 2): 0 | 1 | 2 {
    const textTrim = textRaw.trimStart();
    if (textTrim.startsWith(')')) return 0;
    if (textTrim.startsWith('(')) {
        return (/\bltrim\bi/).test(getLStr(textTrim)) ? 2 : 1;
    }
    return LTrim;
}
