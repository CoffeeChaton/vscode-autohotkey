export function getClassDetail(lStr: string, colFix: number, name: string): string {
    return lStr.substr(colFix + name.length, lStr.length)
        .replace(/\bextends\b/i, '')
        .trim()
        .replace('{', '')
        .trim();
    // TODO ahkExtends
}
