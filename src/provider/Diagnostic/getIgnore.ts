import { EDiagBase } from '../../Enum/EDiagBase';

export function getIgnore(textRaw: string, line: number, IgnoreLine: number): number {
    // ;@ahk-neko-ignore  30 line.

    // ";@ahk-neko-ignore 3".length is 19

    // eslint-disable-next-line no-magic-numbers
    if (textRaw.length < 19) return IgnoreLine;
    if (!textRaw.includes(EDiagBase.ignore)) return IgnoreLine;

    const ignoreMatch: RegExpMatchArray | null = textRaw.match(/^\s*;@ahk-neko-ignore\s+(\d+)\s/iu);
    if (ignoreMatch === null) return IgnoreLine;

    const numberOfIgnore = Number(ignoreMatch[1]);

    return Number.isNaN(numberOfIgnore)
        ? 0 // <-- if numberOfIgnore is NaN, return 0.
        : numberOfIgnore + line;
}
