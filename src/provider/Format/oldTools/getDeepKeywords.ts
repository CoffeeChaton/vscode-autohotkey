import type { DeepReadonly } from '../../../globalEnum';

/**
 * // TODO add diag of crazy code
 * // FIXME fix syntax-highlight of for()
 */
const commandRegexps: DeepReadonly<RegExp[]> = [
    /^if\b(?!:)/iu,
    /^while\b(?!:)/iu,
    // ahk v1 allow like if() and while()
    //        but there are flow of command

    // Edge cases, someone will let the label-name as a control-flow-statement name. -> not :
    // Edge cases, someone will let the funcs-name as a control-flow-statement name. -> not (
    /^ifMsgBox\b(?!:|\()/iu,
    /^else\b(?!:|\()/iu,
    /^loop\b(?!:|\()/iu,
    /^for\b(?!:|\()/iu,
    /^if(?:not)?exist\b(?!:|\()/iu,
    /^ifWin(?:not)?(?:active|exist)\b(?!:|\()/iu,
    /^if(?:not)?inString\b(?!:|\()/iu,
    /^try\b(?!:|\()/iu,
    /^catch\b(?!:|\()/iu,
    /^switch\b(?!:|\()/iu,
];

export function getDeepKeywords(lStrTrim: string, oneCommandCode: number, cll: 0 | 1): number {
    const occ: number = Math.max(oneCommandCode, 0);
    const lStrTrimFix: string = lStrTrim.replace(/^[ \t}]*/u, '');

    const tf: boolean = commandRegexps.some((reg: Readonly<RegExp>): boolean => reg.test(lStrTrimFix));
    if (tf) return occ + 1;

    if (cll === 1) return occ;

    return 0;
}

// FIXME fmt
// IfNotExist, %AhkScript%
//     if !iOption
//         Util_Error((IsFirstScript ? "Script" : "#include") " file cannot be opened.", 0x32, """" AhkScript """")
//     else return
// ;---end----
