import type { TValMetaIn } from '../../../../AhkSymbol/CAhkFunc';
import type { TGetFnDefNeed } from '../TFnVarDef';
import { getValMeta } from './getValMeta';
import { OutputCommandBaseMap } from './OutputBaseMap';

/**
 * OutputVar
 * [Other Functions](https://www.autohotkey.com/docs/Functions.htm#Other_Functions)
 * - https://github.com/polyethene/AutoHotkey-Scripts/blob/master/Functions.ahk
 * Provides a callable function for each AutoHotkey command that has an OutputVar.
 */
export function OutputVarCommandBase(need: TGetFnDefNeed, keyWord: string, col: number): null {
    const len: number | undefined = OutputCommandBaseMap.get(keyWord);
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
