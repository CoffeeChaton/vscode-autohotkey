import { ELTrim } from '../../globalEnum';
// notIn = 0,
// flagS = 1,
// flagM = 2,
// flagE = 3,
// noFlagS = 11,
// noFlagM = 12,
// noFlagE = 13,

export function inLTrimRange(textTrimStart: string, LTrim: ELTrim): ELTrim {
    if (LTrim === ELTrim.none) {
        if (textTrimStart.startsWith('(')) {
            return (/^\(\s*\bLTrim\b/ui).test(textTrimStart)
                ? ELTrim.FlagS
                : ELTrim.noFlagS;
        }
        return ELTrim.none; // 99%
    }
    if (LTrim === ELTrim.FlagS || LTrim === ELTrim.FlagM) {
        return textTrimStart.startsWith(')')
            ? ELTrim.FlagE
            : ELTrim.FlagM;
    }
    if (LTrim === ELTrim.noFlagS || LTrim === ELTrim.noFlagM) {
        return textTrimStart.startsWith(')')
            ? ELTrim.noFlagE
            : ELTrim.noFlagM;
    }
    // END
    // Last Line Start with )
    //  LTrim === ELTrim.flagE || LTrim === ELTrim.noFlagE
    if (textTrimStart.startsWith('(')) {
        return (/^\(\s*\bLTrim\b/ui).test(textTrimStart)
            ? ELTrim.FlagS
            : ELTrim.noFlagS;
    }
    return ELTrim.none; // 99%
}
