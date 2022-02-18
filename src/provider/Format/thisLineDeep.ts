import { hasDoubleSemicolon } from './hasDoubleSemicolon';

export function thisLineDeep(textFix: string): 1 | 0 {
    // [ContinueLongLine](https://www.autohotkey.com/docs/Scripts.htm#continuation)
    // Hotkeys && HotStrings has '::'
    if (hasDoubleSemicolon(textFix)) {
        return 0;
    }
    const CLL = [
        /^[,.?]/u,
        /^:[^:]/u, // ? : Ternary operation -> ':' // if (hasDoubleSemicolon === true)  will not goto this line.
        /^\+[^+]/u, // +
        /^-[^-]/u, // -
        /^\*[^/]/u, // /^*  but not */
        /^\//u, // /
        /^and\b/ui,
        /^or\b/ui,
        /^\|\|/ui, // ||
        /^&&/u, // &&
        /^[!~&/<>|^]/u,
        /^new\b/ui,
        /^not\b/ui,
        // Don't do it /^%/, because ``` %i%Name := ... ```
    ];
    const iMax = CLL.length;
    for (let i = 0; i < iMax; i++) {
        if (CLL[i].test(textFix)) return 1;
    }
    return 0;
}
