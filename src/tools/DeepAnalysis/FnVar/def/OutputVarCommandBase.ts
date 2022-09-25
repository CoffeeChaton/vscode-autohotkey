import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { replacerSpace } from '../../../str/removeSpecialChar';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';
/* cSpell:disable */

const OutputVarCommandMap: ReadonlyMap<string, RegExp> = new Map([
    // usually case exp: EnvGet, v, %EnvVarName%
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
    // eslint-disable-next-line security/detect-non-literal-regexp
].map((wordUp: string): [string, RegExp] => [wordUp, new RegExp(`(^\\s*${wordUp}[,\\s]*)`, 'iu')]));

/**
 * OutputVar
 * [Other Functions](https://www.autohotkey.com/docs/Functions.htm#Other_Functions)
 * [Polyethene's Command Functions](https://github.com/polyethene/AutoHotkey-Scripts/blob/master/Functions.ahk):
 * Provides a callable function for each AutoHotkey command that has an OutputVar.
 */
export function OutputVarCommandBase(arg: TGetFnDefNeed, fistWordUp: string): null {
    const regexp: RegExp | undefined = OutputVarCommandMap.get(fistWordUp);
    if (regexp === undefined) return null;
    //

    const {
        lStr,
        valMap,
        line,
        paramMap,
        GValMap,
        lineComment,
    } = arg;

    // TODO remove ...regexp
    const lStrFix = lStr.replace(regexp, replacerSpace);

    const v: RegExpMatchArray | null = lStrFix.match(/\b(\w+)\b/ui);
    if (v === null) return null;

    const character: number | undefined = v.index;
    if (character === undefined) return null;

    const RawName: string = v[1];
    const UpName: string = RawName.toUpperCase();
    if (paramMap.has(UpName) || GValMap.has(UpName)) return null;

    const value: TValMetaIn = getValMeta(line, character, RawName, valMap, lineComment);
    valMap.set(UpName, value);

    return null;
}
