export function hasDoubleSemicolon(textFix: string): boolean {
    return textFix.includes('::');
}

/*
```ahk
::t3{{::
    SendRaw, { ccccc
Return

::t4}}::{{{{{{}}}}}}

::t5(((::
    SendRaw, t5 (((((
    SendRaw, t6 }}}}
Return
```
*/
