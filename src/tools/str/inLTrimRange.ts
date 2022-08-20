import { ELTrim } from '../../globalEnum';
import { getLStr } from './removeSpecialChar';
// notIn = 0,
// flagS = 1,
// flagM = 2,
// flagE = 3,
// noFlagS = 11,
// noFlagM = 12,
// noFlagE = 13,

export function inLTrimRange(textTrimStart: string, LTrim: ELTrim): ELTrim {
    if (LTrim === ELTrim.none) {
        if (textTrimStart.startsWith('(') && !textTrimStart.includes(')')) {
            // TODO fix of ) [v1.1.01+]: If a closing parenthesis appears in the continuation section's options
            // (except as a parameter of the Join option),
            // https://www.autohotkey.com/docs/Scripts.htm#continuation
            const s: string = getLStr(textTrimStart.replace(/^\(\s*/ui, ''));
            return (/\bLTrim\b/ui).test(s)
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
