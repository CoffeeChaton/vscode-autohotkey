import type { DeepReadonly } from '../../globalEnum';
import { ContinueLongLine } from './ContinueLongLine';

const commandRegexps: DeepReadonly<RegExp[]> = [
    /^if(?:Msgbox)?\b/iu,
    /^else\b/iu,
    /^loop\b/iu,
    /^for\b/iu,
    /^while\b/iu,
    /^if(?:not)?exist\b/iu,
    /^ifWin(?:not)?(?:active|exist)\b/iu,
    /^if(?:not)?inString\b/iu,
    /^try\b/iu,
    /^catch\b/iu,
    /^switch\b/iu,
];

export function getDeepKeywords(textFix: string, oneCommandCode: number): number {
    const occ = Math.max(oneCommandCode, 0);
    const textFixTwo = textFix.replace(/^\}\s*/u, '');

    const tf = commandRegexps.some((reg: Readonly<RegExp>) => reg.test(textFixTwo));
    if (tf) return occ + 1;

    return (ContinueLongLine(textFixTwo) !== 0)
        ? occ
        : 0;
}

// FIXME fmt
// IfNotExist, %AhkScript%
//     if !iOption
//         Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """")
//     else return
// ;---end----
