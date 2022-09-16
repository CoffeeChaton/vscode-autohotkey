import type { DeepWriteable, TMultilineFlag, TPos } from '../../globalEnum';
import { EMultiline } from '../../globalEnum';
import { replacerSpace } from './removeSpecialChar';

type TGetMultilineFlag = {
    textRaw: string;
    strArray: readonly string[];
    line: number;
};

// eslint-disable-next-line max-lines-per-function
function getMultilineFlag({ textRaw, strArray, line }: TGetMultilineFlag): TMultilineFlag {
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
        blockLineStart: line,
        blockLineEnd: line,
        isExpress: false,
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

    for (const str of strArray.slice(line)) {
        const textTrimStart: string = str.trimStart();
        if (textTrimStart.startsWith(')')) {
            flag.isExpress = textTrimStart.startsWith(')"');
            break;
        }

        flag.blockLineEnd += 1;
    }

    // console.log('🚀 ~ getMultilineFlag ~ textTrimStart', {
    //     A: flag.isExpress,
    //     B: strArray[line + 1],
    //     C: strArray[flag.blockLineEnd - 1],
    // });

    return flag;
}

type TGetMultiline = {
    textTrimStart: string;
    multiline: EMultiline;
    multilineFlag: TMultilineFlag;
    textRaw: string;
    strArray: readonly string[];
    line: number;
};

export function getMultiline(
    {
        textTrimStart,
        multiline,
        multilineFlag,
        textRaw,
        strArray,
        line,
    }: TGetMultiline,
): [EMultiline, TMultilineFlag] {
    if (multiline === EMultiline.none) {
        return textTrimStart.startsWith('(') && !textTrimStart.includes(')')
            ? [EMultiline.start, getMultilineFlag({ textRaw, strArray, line })]
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
        ? [EMultiline.start, getMultilineFlag({ textRaw, strArray, line })] // look 0.1% case...
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
