import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';
/* cSpell:disable */

const OutputVarCommandMap: ReadonlyMap<string, number> = new Map([
    // usually case exp: EnvGet, v, %EnvVarName%
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

/**
 * OutputVar
 * [Other Functions](https://www.autohotkey.com/docs/Functions.htm#Other_Functions)
 * [Polyethene's Command Functions](https://github.com/polyethene/AutoHotkey-Scripts/blob/master/Functions.ahk):
 * Provides a callable function for each AutoHotkey command that has an OutputVar.
 */
export function OutputVarCommandBase(need: TGetFnDefNeed, keyWord: string, col: number): null {
    const len: number | undefined = OutputVarCommandMap.get(keyWord);
    if (len === undefined) return null;
    //
    const {
        lStr,
        line,
        paramMap,
        GValMap,
        valMap,
        lineComment,
        fnMode,
    } = need;

    const ma: RegExpMatchArray | null = lStr.slice(col + len).match(/\b(\w+)\b/u);
    if (ma === null) return null;

    const character: number = (ma.index ?? 0) + col + len;
    const RawName: string = ma[1];
    const UpName: string = RawName.toUpperCase();
    if (paramMap.has(UpName) || GValMap.has(UpName)) return null;

    const value: TValMetaIn = getValMeta({
        line,
        character,
        RawName,
        valMap,
        lineComment,
        fnMode,
    });
    valMap.set(UpName, value);
    return null;
}

// FileGetTime, OutputVar
// FileGetTime OutputVar
//           ^ miss "," is OK ? Why? ...
