import { DeepReadonly } from '../../globalEnum';
import { thisLineDeep } from './thisLineDeep';

export function getDeepKeywords(textFix: string, oneCommandCode: number): number {
    const occ = Math.max(oneCommandCode, 0);
    const textFixTwo = textFix.replace(/^\}\s*/u, '');
    const commandRegexps: DeepReadonly<RegExp[]> = [
        /^if(?:msgbox)?\b/iu,
        /^else\b/iu,
        /^loop\b/iu,
        /^for\b/iu,
        /^while\b/ui,
        /^if(?:not)?exist\b/iu,
        /^ifWin(?:not)?(?:active|exist)\b/iu,
        /^if(?:not)?inString\b/iu,
        /^ifmsgbox\b/iu,
        /^try\b/iu,
        /^catch\b/iu,
        /^switch\b/iu,
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
