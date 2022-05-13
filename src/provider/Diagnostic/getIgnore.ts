import { EDiagBase } from '../../Enum/EDiagBase';

export function getIgnore(textRaw: string, line: number, IgnoreLine: number): number {
    // ;@ahk-ignore 30 line.

    // ";@ahk-ignore 3".length is 14

    // eslint-disable-next-line no-magic-numbers
    if (textRaw.length < 14) return IgnoreLine;
    if (textRaw.indexOf(EDiagBase.ignore) === -1) return IgnoreLine;
    const ignoreMatch: RegExpMatchArray | null = textRaw.match(/^\s*;@ahk-ignore\s+(\d+)\s/iu);
    if (ignoreMatch === null) {
        return IgnoreLine;
    }
    const numberOfIgnore = Number(ignoreMatch[1]);
    return numberOfIgnore + line;
}
