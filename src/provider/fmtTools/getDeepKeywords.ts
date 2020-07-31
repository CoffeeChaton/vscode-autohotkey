
/* eslint no-magic-numbers: ["error", { "ignore": [-1,0,1] }] */
import * as vscode from 'vscode';
import { thisLineDeep } from './thisLineDeep';

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

export function getDeepKeywords(textFix: string, oneCommandCode: number): number {
    const occ = Math.max(oneCommandCode, 0);
    const textFixTwo = textFix.replace(/^\}\s*/, '');
    for (const command of commandRegexps) {
        // if (textFixTwo.search(command) > -1) {
        if (command.test(textFixTwo)) {
            return textFixTwo.endsWith('{')
                ? 0
                : occ + 1;
        }
    }
    return (thisLineDeep(textFixTwo) !== 0)
        ? occ
        : 0;
}
