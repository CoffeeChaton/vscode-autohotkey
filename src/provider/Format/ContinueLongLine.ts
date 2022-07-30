import type { DeepReadonly } from '../../globalEnum';
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

const CLL: DeepReadonly<RegExp[]> = [
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

export function ContinueLongLine(textFix: string): 0 | 1 {
    // [ContinueLongLine](https://www.autohotkey.com/docs/Scripts.htm#continuation)
    // Hotkeys && HotStrings has '::'
    if (textFix.includes('::')) return 0;

    return CLL.some((reg: Readonly<RegExp>) => reg.test(textFix))
        ? 1
        : 0;
}
