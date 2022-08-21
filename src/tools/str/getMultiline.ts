import type { TMultilineFlag } from '../../globalEnum';
import { EMultiline } from '../../globalEnum';
import { getLStr, replacerSpace } from './removeSpecialChar';
// notIn = 0,
// flagS = 1,
// flagM = 2,
// flagE = 3,
// noFlagS = 11,
// noFlagM = 12,
// noFlagE = 13,

function getMultilineFlag(textTrimStart: string): TMultilineFlag {
    const arr: readonly string[] = getLStr(textTrimStart.replace(/^\s*\(\s*/ui, replacerSpace)).split(' ');
    const flag: TMultilineFlag = {
        Join: false,
        LTrim: false,
        RTrim0: false,
        Comments: false,
        '%': false,
        ',': false,
        '`': false,
        unknown: false, // ... need for of
    };

    for (const str of arr) {
        if ((/^Join.*$/ui).test(str)) {
            flag.Join = true;
        } else if ((/^LTrim$/ui).test(str)) {
            flag.LTrim = true;
        } else if ((/^RTrim0$/ui).test(str)) {
            flag.RTrim0 = true;
        } else if ((/^(Comments|Comment|Com|C)$/ui).test(str)) {
            flag.Comments = true;
        } else {
            switch (str) {
                case '%':
                    flag['%'] = true;
                    break;

                case ',':
                    flag[','] = true;
                    break;

                case '`':
                    flag['`'] = true;
                    break;

                default:
                    flag.unknown = true;
            }
        }
    }
    return flag;
}

export function getMultiline(
    textTrimStart: string,
    multiline: EMultiline,
    multilineFlag: TMultilineFlag,
): [EMultiline, TMultilineFlag] {
    if (multiline === EMultiline.none) {
        return textTrimStart.startsWith('(') && !textTrimStart.includes(')')
            ? [EMultiline.start, getMultilineFlag(textTrimStart)]
            : [EMultiline.none, null]; // 99%
    }

    if (multiline === EMultiline.start) {
        return textTrimStart.startsWith(')')
            ? [EMultiline.end, null]
            : [EMultiline.mid, multilineFlag];
    }

    if (multiline === EMultiline.mid) {
        return textTrimStart.startsWith(')')
            ? [EMultiline.end, null]
            : [EMultiline.mid, multilineFlag];
    }

    // END
    // if (LTrim === EMultiline.end)
    return textTrimStart.startsWith('(') && !textTrimStart.includes(')')
        ? [EMultiline.start, getMultilineFlag(textTrimStart)]
        : [EMultiline.none, null]; // 99%
}

// https://www.autohotkey.com/docs/Scripts.htm#continuation
