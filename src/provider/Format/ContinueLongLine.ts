function hasDoubleSemicolon(textFix: string): boolean {
    return textFix.includes('::');
}

/*
```ahk
::t3{{::
    SendRaw, { testC
Return

::t4}}::{{{{{{}}}}}}

::t5(((::
    SendRaw, t5 (((((
    SendRaw, t6 }}}}
Return
```
*/

export function ContinueLongLine(textFix: string): 0 | 1 {
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
    for (const reg of CLL) {
        if (reg.test(textFix)) return 1;
    }
    return 0;
}
