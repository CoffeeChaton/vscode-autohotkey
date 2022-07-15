import type { DeepReadonly } from '../../globalEnum';
import { ContinueLongLine } from './ContinueLongLine';

export function getDeepKeywords(textFix: string, oneCommandCode: number): number {
    const occ = Math.max(oneCommandCode, 0);
    const textFixTwo = textFix.replace(/^\}\s*/u, '');
    const commandRegexps: DeepReadonly<RegExp[]> = [
        /^if(?:Msgbox)?\b/iu,
        /^else\b/iu,
        /^loop\b/iu,
        /^for\b/iu,
        /^while\b/ui,
        /^if(?:not)?exist\b/iu,
        /^ifWin(?:not)?(?:active|exist)\b/iu,
        /^if(?:not)?inString\b/iu,
        /^try\b/iu,
        /^catch\b/iu,
        /^switch\b/iu,
    ];
    for (const reg of commandRegexps) {
        if (reg.test(textFixTwo)) {
            return occ + 1;
        }
    }
    return (ContinueLongLine(textFixTwo) !== 0)
        ? occ
        : 0;
}
