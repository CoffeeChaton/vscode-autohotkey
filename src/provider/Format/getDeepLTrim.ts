import { ELTrim } from '../../globalEnum';

// return deep of LTrim
export function getDeepLTrim(LTrim: ELTrim): 0 | 1 | 2 {
    switch (LTrim) {
        case ELTrim.none:
            return 0;
        case ELTrim.FlagS:
            return 1;
        case ELTrim.FlagM:
            return 2;
        case ELTrim.FlagE:
            return 1;
        case ELTrim.noFlagS:
            return 1;
        case ELTrim.noFlagM:
            return 0;
        case ELTrim.noFlagE:
            return 1;
        default:
            return 0;
    }
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
