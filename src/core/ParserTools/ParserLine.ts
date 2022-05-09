import {
    CAhkComment,
    CAhkHotKeys,
    CAhkHotString,
    CAhkInclude,
    CAhkLabel,
    TLineClass,
} from '../../AhkSymbol/CAhkLine';
import { getRangeOfLine } from '../../tools/range/getRangeOfLine';
import { TFuncInput } from '../getChildren';
import { getComment } from './getComment';

type TParserLine = TLineClass;

type TLineRuler = Readonly<{
    ClassName: typeof CAhkInclude | typeof CAhkLabel | typeof CAhkHotString | typeof CAhkHotKeys;
    getName(strTrim: string): string | null;
    test(strTrim: string): boolean;
}>;

const LineRuler: readonly TLineRuler[] = [
    {
        ClassName: CAhkInclude,

        getName(strTrim: string): string | null {
            return strTrim;
        },

        test(strTrim: string): boolean {
            if (!strTrim.startsWith('#')) return false;
            return (/^#Include(?:Again)?\s/iu).test(strTrim);
        },
    },
    {
        ClassName: CAhkLabel,

        getName(strTrim: string): string {
            const col = strTrim.indexOf(':');
            return strTrim.substring(0, col + 1);
        },

        test(strTrim: string): boolean {
            if (!strTrim.endsWith(':')) return false;
            if (strTrim.endsWith('::')) return false;
            // Generally, aside from whitespace and comments, no other code can be written on the same line as a label.
            return (/^\w+:$/u).test(strTrim);
        },
    },
    {
        ClassName: CAhkHotString,

        getName(strTrim: string): string | null {
            const e: RegExpMatchArray | null = strTrim.match(/^(:[^:]*?:[^:]+::)/u);
            return (e !== null)
                ? e[1]
                : null;
        },

        test(strTrim: string): boolean {
            // https://www.autohotkey.com/docs/misc/Labels.htm#syntax-and-usage
            // HotString labels consist of a colon, zero or more options, another colon, an abbreviation and double-colon.
            // if (!strTrim.startsWith(':')) return false;
            if (strTrim.indexOf('::') === -1) return false;
            return (/^:[^:]*?:[^:]+::/u).test(strTrim);
        },
    },
    {
        ClassName: CAhkHotKeys,

        getName(strTrim: string): string | null {
            // ex ~F10::
            const e: RegExpExecArray | null = (/^([^:]+::)/u).exec(strTrim);
            return (e !== null)
                ? e[1]
                : null;
        },

        test(strTrim: string): boolean {
            // Hotkey labels consist of a hotkey followed by double-colon.
            // if (strTrim.startsWith(':')) return false;
            if (strTrim.indexOf('::') === -1) return false;
            return (/^[^:]+::/u).test(strTrim);
        },
    },
];

export function ParserLine(FuncInput: TFuncInput): null | TParserLine | CAhkComment {
    const {
        fistWordUp,
        line,
        lStr,
        document,
        textRaw,
    } = FuncInput;

    const strTrim: string = lStr.trim();
    if (strTrim === '') return getComment(FuncInput);

    if (fistWordUp.length > 0) return null;

    for (const { test, getName, ClassName } of LineRuler) {
        if (!test(strTrim)) continue;
        const name: string | null = getName(strTrim);
        if (name === null) continue;

        return new ClassName({
            name,
            range: getRangeOfLine(line, lStr, textRaw.length),
            selectionRange: getRangeOfLine(line, lStr, lStr.length),
            uri: document.uri,
        });
    }
    return null;
}
