export function getClassDetail(lStr: string, colFix: number, name: string): string {
    return lStr.substring(colFix + name.length, lStr.length + colFix + name.length)
        .replace(/\bextends\b/iu, '')
        .trim()
        .replace('{', '')
        .trim();
}
