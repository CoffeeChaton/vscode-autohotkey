import type { DeepWriteable, TMultilineFlag, TPos } from '../../globalEnum';
import { EMultiline } from '../../globalEnum';
import { replacerSpace } from './removeSpecialChar';

// eslint-disable-next-line max-lines-per-function
function getMultilineFlag(textRaw: string): TMultilineFlag {
    const arr: readonly string[] = textRaw
        .replace(/^\s*\(\s*/ui, replacerSpace)
        .split(' ')
        .filter((str: string): boolean => str.trim().length > 0);

    const flag: DeepWriteable<TMultilineFlag> = {
        Join: [],
        LTrim: [],
        RTrim0: [],
        CommentFlag: [],
        Percent: [],
        comma: [],
        accent: [],
        unknown: [], // ... need for of
        L: textRaw.indexOf('('),
        R: textRaw.length,
    };
    let oldPos: number = textRaw.indexOf('(');

    for (const str of arr) {
        const col: number = textRaw.indexOf(str, oldPos);
        oldPos = col + str.length;
        const pos: TPos = {
            col,
            len: str.length,
        };
        //
        if ((/^Join.*$/ui).test(str)) {
            flag.Join.push(pos);
        } else if ((/^LTrim$/ui).test(str)) {
            flag.LTrim.push(pos);
        } else if ((/^RTrim0$/ui).test(str)) {
            flag.RTrim0.push(pos);
        } else if ((/^(Comments|Comment|Com|C)$/ui).test(str)) {
            flag.CommentFlag.push(pos);
        } else if (str.startsWith(';')) {
            flag.R = col;
            break; // -----break-------is line Comments
        } else {
            switch (str) {
                case '%':
                    flag.Percent.push(pos);
                    break;

                case ',':
                    flag.comma.push(pos);
                    break;

                case '`':
                    flag.accent.push(pos);
                    break;

                default:
                    flag.unknown.push(pos);
            }
        }
    }
    return flag;
}

export function getMultiline(
    textTrimStart: string,
    multiline: EMultiline,
    multilineFlag: TMultilineFlag,
    textRaw: string,
): [EMultiline, TMultilineFlag] {
    if (multiline === EMultiline.none) {
        return textTrimStart.startsWith('(') && !textTrimStart.includes(')')
            ? [EMultiline.start, getMultilineFlag(textRaw)]
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
        ? [EMultiline.start, getMultilineFlag(textTrimStart)] // look 0.1% case...
        : [EMultiline.none, null]; // 99%
}

// https://www.autohotkey.com/docs/Scripts.htm#continuation-section

// 0.1% case, but can run....
// Var = ; <---------------------- not :=
//     ( LTrim join; ;ccc
//         1
//         2
//         3
//         4

//     )
//     ( LTrim

//         AA
//         BB
//     )
// ;...
// MsgBox, % Var
// ;show 1;2;3;4;\nAA\nBB
