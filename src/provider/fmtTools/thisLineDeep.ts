
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
// import { removeSpecialChar2, getSkipSign } from '../../tools/removeSpecialChar';
import { hasDoubleSemicolon } from './hasDoubleSemicolon';

const CLL = [
    /^[,.?]/,
    /^:[^:]/,
    /^\+[^+]/, // +
    /^-[^-]/, // -
    /^and\b/,
    /^or\b/,
    /^\|\|/,
    /^&&/,
    /^[!~&/<>|^]/,
    /^\*[^/]/, // *
    /^\//, // /
    /^new\b\s/,
    /^not\b\s/,
    // Don't do it /^%/, because ``` %i%Name := ... ```
];
const iMax = CLL.length;
export function thisLineDeep(textFix: string): 1 | 0 {
    // [ContinueLongLine](https://www.autohotkey.com/docs/Scripts.htm#continuation)
    // Hotkeys && HotStrings has '::'
    if (hasDoubleSemicolon(textFix)) {
        return 0;
    }

    for (let i = 0; i < iMax; i += 1) {
        // if (textFix.search(CLL[i]) > -1) return 1;
        if (CLL[i].test(textFix)) return 1;
    }
    return 0;
}
