/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable max-lines */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1,2,20] }] */

export function getClassDetail(lStr: string, colFix: number, name: string): string {
    const ahkExtends = lStr.substr(colFix + name.length, lStr.length)
        .replace(/\bextends\b/i, '')
        .trim()
        .replace('{', '')
        .trim();
    return ahkExtends;
}
