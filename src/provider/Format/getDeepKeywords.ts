import type { DeepReadonly } from '../../globalEnum';
import { ContinueLongLine } from './ContinueLongLine';

// Edge cases, someone will let the label-name as a control-flow-statement name.
const commandRegexps: DeepReadonly<RegExp[]> = [
    /^if(?:MsgBox)?\b(?!:)/iu,
    /^else\b(?!:)/iu,
    /^loop\b(?!:)/iu,
    /^for\b(?!:)/iu,
    /^while\b(?!:)/iu,
    /^if(?:not)?exist\b(?!:)/iu,
    /^ifWin(?:not)?(?:active|exist)\b(?!:)/iu,
    /^if(?:not)?inString\b(?!:)/iu,
    /^try\b(?!:)/iu,
    /^catch\b(?!:)/iu,
    /^switch\b(?!:)/iu,
];

export function getDeepKeywords(lStrTrim: string, oneCommandCode: number): number {
    const occ: number = Math.max(oneCommandCode, 0);
    const lStrTrimFix: string = lStrTrim.replace(/^[ \t}]*/u, '');

    const tf: boolean = commandRegexps.some((reg: Readonly<RegExp>): boolean => reg.test(lStrTrimFix));
    if (tf) return occ + 1;

    if (ContinueLongLine(lStrTrimFix) !== 0) return occ;

    return occ - 1;
}

// FIXME fmt
// IfNotExist, %AhkScript%
//     if !iOption
//         Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """")
//     else return
// ;---end----
