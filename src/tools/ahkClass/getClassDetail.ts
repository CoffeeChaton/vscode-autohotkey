export function getClassDetail(lStr: string, colFix: number, name: string): string {
    const ahkExtends = lStr.substr(colFix + name.length, lStr.length)
        .replace(/\bextends\b/i, '')
        .trim()
        .replace('{', '')
        .trim();
    return ahkExtends;
}
