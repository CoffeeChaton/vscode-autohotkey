/* eslint-disable security/detect-object-injection */
/* eslint-disable no-plusplus */
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
import { thisLineDeep } from './thisLineDeep';
import { DeepReadonly } from '../../globalEnum';

export function getDeepKeywords(textFix: string, oneCommandCode: number): number {
    const occ = Math.max(oneCommandCode, 0);
    const textFixTwo = textFix.replace(/^\}\s*/, '');
    const commandRegexps: DeepReadonly<RegExp[]> = [
        /^if(?:msgbox)?\b/i,
        /^else\b/i,
        /^loop\b/i,
        /^for\b/i,
        /^while\b/i,
        /^if(?:not)?exist\b/i,
        /^ifWin(?:not)?(?:active|exist)\b/i,
        /^if(?:not)?(?:in)string\b/i,
        /^ifmsgbox\b/i,
        /^try\b/i,
        /^catch\b/i,
        /^switch\b/i,
    ];
    const iMax = commandRegexps.length;
    for (let i = 0; i < iMax; i++) {
        if (commandRegexps[i].test(textFixTwo)) {
            return occ + 1;
        }
    }
    return (thisLineDeep(textFixTwo) !== 0)
        ? occ
        : 0;
}
