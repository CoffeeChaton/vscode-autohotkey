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
    /^and\b/iu,
    /^or\b/iu,
    /^\|\|/u, // ||
    /^&&/u, // &&
    /^[!~&/<>|^]/u,
    /^new\b/iu,
    /^not\b/iu,
    // Don't do it /^%/, because ``` %i%Name := ... ```
];

export function ContinueLongLine(textFix: string): 0 | 1 {
    // [ContinueLongLine](https://www.autohotkey.com/docs/v1/Scripts.htm#continuation)
    // Hotkeys && HotStrings has '::'
    if (textFix.includes('::')) return 0;

    return CLL.some((reg: Readonly<RegExp>) => reg.test(textFix))
        ? 1
        : 0;
}
