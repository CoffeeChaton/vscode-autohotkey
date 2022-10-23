/* eslint-disable max-statements */
/* eslint-disable max-lines-per-function */
import type { TParamMapIn, TValMapIn, TValMetaIn } from '../../../AhkSymbol/CAhkFunc';
import type { TGValMap } from '../../../core/ParserTools/ahkGlobalDef';
import type { TVarData } from '../../../core/ParserTools/varMixedAnnouncement';
import { varMixedAnnouncement } from '../../../core/ParserTools/varMixedAnnouncement';
import type { TTokenStream } from '../../../globalEnum';
import type { TBrackets } from '../../Bracket';
import { forLoop } from './def/forLoop';
import { getValMeta } from './def/getValMeta';
import { OutputVarCommandBase } from './def/OutputVarCommandBase';
import { OutputVarCommandPlus } from './def/OutputVarCommandPlus';
import { varSetCapacityFunc } from './def/varSetCapacityFunc';
import { walrusOperator } from './def/walrusOperator';
import { EFnMode } from './EFnMode';
import type { TGetFnDefNeed } from './TFnVarDef';

type TParam = {
    varDataList: TVarData[];
    line: number;
    valMap: TValMapIn;
    lineComment: string;
    fistWordVarMix: 'LOCAL' | 'STATIC';
};
function setVarMix({
    varDataList,
    line,
    valMap,
    lineComment,
    fistWordVarMix,
}: TParam): void {
    for (const { ch, rawName } of varDataList) {
        const value: TValMetaIn = getValMeta(
            {
                line,
                character: ch,
                RawName: rawName,
                valMap,
                lineComment,
                fnMode: fistWordVarMix === 'LOCAL'
                    ? EFnMode.forceLocal
                    : EFnMode.static,
            },
        );
        valMap.set(rawName.toUpperCase(), value);
    }
}

function setFnMode(fistWordUp: string, lStrTrimLen: number, fnMode: EFnMode): EFnMode {
    if (fistWordUp === 'STATIC' && lStrTrimLen > 'STATIC'.length) {
        return EFnMode.static;
    }
    if (fistWordUp === 'LOCAL' && lStrTrimLen > 'LOCAL'.length) {
        return EFnMode.forceLocal;
    }
    return fnMode;
}

type TFnVarDef = {
    valMap: TValMapIn;
    fnMode: EFnMode;
};

export function getFnVarDef(
    allowList: readonly boolean[],
    DocStrMap: TTokenStream,
    paramMap: TParamMapIn,
    GValMap: TGValMap,
    fnModeDefault: EFnMode,
): TFnVarDef {
    let fnMode: EFnMode = fnModeDefault;
    let fistWordVarMix: '' | 'GLOBAL' | 'LOCAL' | 'STATIC' = '';
    let BracketsRaw: TBrackets = [0, 0, 0];

    const valMap: TValMapIn = new Map<string, TValMetaIn>();
    for (
        const {
            lStr,
            line,
            lineComment,
            fistWordUp,
            cll,
            fistWordUpCol,
        } of DocStrMap
    ) {
        if (!allowList[line]) continue; // in arg Range
        if (line > allowList.length) break;

        const lStrTrimLen: number = lStr.trim().length;
        if (lStrTrimLen < 2) continue; // a=b need length >=3

        if (fnMode !== EFnMode.normal) {
            fnMode = setFnMode(fistWordUp, lStrTrimLen, fnMode);
        }

        if (
            lStrTrimLen > 'STATIC'.length
            && (fistWordUp === 'STATIC' || fistWordUp === 'LOCAL' || fistWordUp === 'GLOBAL')
        ) {
            fistWordVarMix = fistWordUp;
            BracketsRaw = [0, 0, 0];
        } else if (fistWordVarMix !== '' && cll === 1) {
            // nothing
            // fistWordVarMix = the last line fistWordUp
        } else {
            fistWordVarMix = '';
        }

        if (fistWordVarMix === 'GLOBAL') continue;

        if (fistWordVarMix === 'LOCAL' || fistWordVarMix === 'STATIC') {
            const strF: string = lStr
                .replace(/^\s*\{?\s*\b(?:static|local)\b[,\s]+/ui, ',')
                .padStart(lStr.length, ' ');

            const { varDataList, Brackets } = varMixedAnnouncement(strF, BracketsRaw);
            BracketsRaw = Brackets;

            setVarMix({
                varDataList,
                line,
                valMap,
                lineComment,
                fistWordVarMix,
            });
            continue;
        }

        const need: TGetFnDefNeed = {
            lStr,
            valMap,
            line,
            paramMap,
            GValMap,
            lStrTrimLen,
            lineComment,
            fnMode,
        };
        walrusOperator(need); // :=
        varSetCapacityFunc(need); // VarSetCapacity(varName) or NumGet(varName) or NumGet(&varName)
        forLoop(need); // for var1 , var2 in
        OutputVarCommandBase(need, fistWordUp, fistWordUpCol);
        OutputVarCommandPlus(need, fistWordUp, fistWordUpCol);

        // not plan to support this case....
        // DllCall("DllFile\Function" , Type1, Arg1, Type2, Arg2, "Cdecl ReturnType")
        // ----------------------------------------------------------------^
        // FoundPos := RegExMatch(Haystack, NeedleRegEx , OutputVar, StartingPos := 1)
        //                                  ^ "i)abc"    https://www.autohotkey.com/docs/commands/RegExMatch.htm#MatchObject
        // --------------------------------------------------^
        // New GUI options: +HwndOutputVar, +ParentGUI
        //                     ^ ...WTF?
    }

    return {
        valMap,
        fnMode,
    };
}
