import { EDiagBase } from '../../Enum/EDiagBase';

export function getIgnore(textRaw: string, line: number, IgnoreLine: number): number {
    // ;@ahk-ignore 30 line.
    // textRaw
    if (textRaw.indexOf(EDiagBase.ignore) === -1) return IgnoreLine;
    const ignoreExec = (/^\s*;@ahk-ignore\s+(\d+)\s/iu).exec(textRaw);
    if (ignoreExec === null) {
        return IgnoreLine;
    }
    const numberOfIgnore = Number(ignoreExec[1]);
    return numberOfIgnore + line;
}
