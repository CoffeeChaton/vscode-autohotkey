import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import { FindExprDelim } from '../../../zFromCpp/FindExprDelim';
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

type TScanData = {
    RawNameNew: string;
    lPos: number;
};

function spiltCommandOne(lStr: string, quickMake: number): TScanData {
    let make = quickMake;

    const oldMake: number = 1 + FindExprDelim(lStr, ',', make + 1);
    make = FindExprDelim(lStr, ',', oldMake);
    const partStr: string = lStr.slice(oldMake, make);
    const RawNameNew: string = partStr.trim();

    return {
        RawNameNew,
        lPos: oldMake + partStr.indexOf(RawNameNew),
    };
}

/**
 * OutputVar
 * [Other Functions](https://www.autohotkey.com/docs/Functions.htm#Other_Functions)
 * [Polyethene's Command Functions](https://github.com/polyethene/AutoHotkey-Scripts/blob/master/Functions.ahk):
 * Provides a callable function for each AutoHotkey command that has an OutputVar.
 *
 * 15.11ms 38.29ms
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

    const { RawNameNew, lPos } = spiltCommandOne(lStr, quickMake);

    const UpName: string = RawNameNew.toUpperCase();
    if (paramMap.has(UpName) || GValMap.has(UpName)) return null;

    const value: TValMetaIn = getValMeta(line, lPos, RawNameNew, valMap, lineComment);
    valMap.set(UpName, value);
    return null;
}
