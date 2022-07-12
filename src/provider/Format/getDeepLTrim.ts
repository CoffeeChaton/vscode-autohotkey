/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2] }] */

// return deep of LTrim
export function getDeepLTrim(inLTrim: 0 | 1 | 2, textRaw: string): 0 | 1 | 2 {
    if (textRaw.trim().startsWith('(')) return 1;
    if (inLTrim > 0) return 2;
    if (textRaw.trim().startsWith(')')) return 1; // FIXME
    return 0;
}

/*
test code
----------------------------------------------------------------------------------------------------
    test1 := "
        ( LTrim ; has LTrim, this line deep === test2 line deep +1
            deep+1...
            deep+1...
            deep+1...
        )" ; this line deep === test2 line deep +1
----------------------------------------------------------------------------------------------------
    test2 := "
        (  ;not has LTrim, this line deep === test2 line deep +1
deepRaw...
    deepRaw...
            deepRaw...
deepRaw...
                            deepRaw...
                        deepRaw...
        )" ;this line deep === test2 line deep +1
----------------------------------------------------------------------------------------------------
*/
