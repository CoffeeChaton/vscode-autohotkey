/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
import { thisLineDeep } from './thisLineDeep';

export function getDeepKeywords(textFix: string, oneCommandCode: number): number {
    const occ = Math.max(oneCommandCode, 0);
    const textFixTwo = textFix.replace(/^\}\s*/, '');
    const commandRegexps: readonly RegExp[] = [
        /^if(?:msgbox)?\b/,
        /^else\b/,
        /^loop\b/,
        /^for\b/,
        /^while\b/,
        /^if(?:not)?exist\b/,
        /^ifwin(?:not)?(?:active|exist)\b/,
        /^if(?:not)?(?:in)string\b/,
        /^ifmsgbox\b/,
        /^try\b/,
        /^catch\b/,
        /^switch\b/,
    ];
    const iMax = commandRegexps.length;
    // for (const command of commandRegexps) {
    for (let i = 0; i < iMax; i++) {
        // if (textFixTwo.search(command) > -1) {
        if (commandRegexps[i].test(textFixTwo)) {
            return occ + 1;
        }
    }
    return (thisLineDeep(textFixTwo) !== 0)
        ? occ
        : 0;
}
