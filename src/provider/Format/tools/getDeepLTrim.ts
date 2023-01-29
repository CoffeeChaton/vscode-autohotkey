import type { TMultilineFlag } from '../../../globalEnum';
import { EMultiline } from '../../../globalEnum';
import { enumLog } from '../../../tools/enumErr';

// return deep of LTrim
export function getDeepLTrim(Multiline: EMultiline, multilineFlag: TMultilineFlag): 0 | 1 {
    switch (Multiline) {
        case EMultiline.none:
            return 0;
        case EMultiline.start:
            return 1;
        case EMultiline.mid:
            if (multilineFlag === null) return 0; // fake case....just keep TypeScript happy
            if (multilineFlag.LTrim.length === 0) return 0;
            return 1;
        case EMultiline.end:
            return 1;
        default:
            enumLog(Multiline, getDeepLTrim.name);
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
