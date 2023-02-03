/**
 * fix of hotStr https://www.autohotkey.com/docs/v1/Hotstrings.htm#intro
 */
export function getLStrHotStr(textRaw: string): string {
    const ma: RegExpMatchArray | null = textRaw.match(/^(\s*:[^:]*:[^:]+::)/u);
    if (ma === null) return '';

    let str: string = ma[1];
    const ln: number = str.length;
    const textRawLn: number = textRaw.length;
    for (let i = ln; i < textRawLn; i++) {
        const s: string = textRaw[i];
        if (
            s === ';' // check "\s;"
            && (textRaw[i - 1] === ' ' || textRaw[i - 1] === '\t')
        ) {
            return str;
        }
        str += '^';
    }
    return str;
}
//
