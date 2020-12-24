import { hasDoubleSemicolon } from './hasDoubleSemicolon';

export function thisLineDeep(textFix: string): 1 | 0 {
    // [ContinueLongLine](https://www.autohotkey.com/docs/Scripts.htm#continuation)
    // Hotkeys && HotStrings has '::'
    if (hasDoubleSemicolon(textFix)) {
        return 0;
    }
    const CLL = [
        /^[,.?]/,
        /^:[^:]/, // ? : Ternary operation -> ':' // if (hasDoubleSemicolon === true)  will not goto this line.
        /^\+[^+]/, // +
        /^-[^-]/, // -
        /^\*[^/]/, // /^*/  but not */
        /^\//, // /
        /^and\b/i,
        /^or\b/i,
        /^\|\|/i, // ||
        /^&&/, // &&
        /^[!~&/<>|^]/,
        /^new\b/i,
        /^not\b/i,
        // Don't do it /^%/, because ``` %i%Name := ... ```
    ];
    const iMax = CLL.length;
    for (let i = 0; i < iMax; i++) {
        if (CLL[i].test(textFix)) return 1;
    }
    return 0;
}
