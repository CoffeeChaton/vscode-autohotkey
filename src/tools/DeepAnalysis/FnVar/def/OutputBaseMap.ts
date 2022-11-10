/* cSpell:disable */

/**
 * @param cmd string -> upCaseString
 * @return number of cmd.len
 * exp:
 * ```ahk
 * EnvGet, v, %EnvVarName%
 * ```
 */
export const OutputCommandBaseMap: ReadonlyMap<string, number> = new Map([
    'ENVADD',
    'ENVDIV',
    'ENVMULT',
    'ENVSUB',
    'SETENV',
    'CATCH',
    'CONTROLGET',
    'CONTROLGETFOCUS',
    'CONTROLGETTEXT',
    'DRIVEGET',
    'DRIVESPACEFREE',
    'ENVGET',
    'FILEGETATTRIB',
    'FILEGETSIZE',
    'FILEGETTIME',
    'FILEGETVERSION',
    'FILEREAD',
    'FILEREADLINE',
    'FILESELECTFILE',
    'FILESELECTFOLDER',
    'FORMATTIME',
    'GETKEYSTATE',
    'GUICONTROLGET',
    'INIREAD',
    'INPUT',
    'INPUTBOX',
    'PIXELGETCOLOR',
    'RANDOM',
    'REGREAD',
    'SOUNDGET',
    'SOUNDGETWAVEVOLUME',
    'STATUSBARGETTEXT',
    'STRINGGETPOS',
    'STRINGLEFT',
    'STRINGLEN',
    'STRINGLOWER',
    'STRINGMID',
    'STRINGREPLACE',
    'STRINGRIGHT',
    'STRINGTRIMLEFT',
    'STRINGTRIMRIGHT',
    'STRINGUPPER',
    'SYSGET',
    'TRANSFORM',
    'WINGET',
    'WINGETACTIVETITLE',
    'WINGETCLASS',
    'WINGETTEXT',
    'WINGETTITLE',
].map((wordUp: string): [string, number] => [wordUp, wordUp.length]));
