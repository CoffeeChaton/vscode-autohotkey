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
 *
 * 24      48
 */
export function OutputVarCommandBase(arg: TGetFnDefNeed, fistWordUp: string): null {
    const quickMake: number | undefined = OutputVarCommandMap.get(fistWordUp);
    if (quickMake === undefined) return null;
    //
    const {
        lStr,
        line,
        paramMap,
        GValMap,
        valMap,
        lineComment,
    } = arg;

    const deep0 = lStr.search(/\S/u);
    const ma: RegExpMatchArray | null = lStr.slice(deep0 + quickMake).match(/\b(\w+)\b/u);
    if (ma === null) return null;

    const lPos: number = (ma.index ?? 0) + deep0 + quickMake;
    const RawNameNew: string = ma[1];
    const UpName: string = RawNameNew.toUpperCase();
    if (paramMap.has(UpName) || GValMap.has(UpName)) return null;

    const value: TValMetaIn = getValMeta(line, lPos, RawNameNew, valMap, lineComment);
    valMap.set(UpName, value);
    return null;
}

// FileGetTime, OutputVar
// FileGetTime OutputVar
//           ^ miss "," is OK ? Why? ...
