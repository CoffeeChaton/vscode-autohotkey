function getFistWord(lStrTrim: string): string {
    // TODO get FistWordUp
    // OK    const isOK: boolean = (/^\w*$/u).test(subStr)
    //           || (/^case\s[^:]+:/iu).test(subStr)
    //           || (/^default\s*:/iu).test(subStr)
    // OK        || (/::\s*\w*$/iu).test(subStr) // allow hotstring or hotkey
    // OK        || (/^[{}]\s*/iu).test(subStr);

    if ((/^[{}]/u).test(lStrTrim)) {
        return lStrTrim
            .replace(/^[{} \t]*/u, '')
            .match(/^(\w+)[\s,]+(?![:+\-*/~.|&^]=)/u)?.[1]
            ?? '';
    }

    if (lStrTrim.includes('::')) {
        // CAhkHotString -> :*:btw::
        // CAhkHotKeys   -> ^a::
        return lStrTrim
            .replace(/^:[^:]*?:[^:]+::\s*/u, '')
            .replace(/^[^:]+::\s*/u, '')
            .match(/^(\w+)[\s,]+(?![:+\-*/~.|&^]=)/u)?.[1]
            ?? '';
    }

    return lStrTrim.match(/^(\w+)[\s,]+(?![:+\-*/~.|&^]=)/u)?.[1]
        ?? '';
}

type TFistWordUpData = {
    fistWordUpCol: number;
    fistWordUp: string;
};

export function getFistWordUpData(
    { lStrTrim, lStr, cll }: { lStrTrim: string; lStr: string; cll: 0 | 1 },
): TFistWordUpData {
    if (cll === 1) {
        return {
            fistWordUpCol: -1,
            fistWordUp: '',
        };
    }

    const fistWord: string = lStrTrim.match(/^(\w+)$/u)?.[1]
        ?? getFistWord(lStrTrim);

    const fistWordUpCol = fistWord === ''
        ? -1
        : lStr.indexOf(fistWord);

    return {
        fistWordUpCol,
        fistWordUp: fistWord.toUpperCase(),
    };
}
