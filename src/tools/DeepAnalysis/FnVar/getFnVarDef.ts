import type { TParamMapIn, TValMapIn, TValMetaIn } from '../../../AhkSymbol/CAhkFunc';
import type { TGValMap } from '../../../core/ParserTools/ahkGlobalDef';
import type { TTokenStream } from '../../../globalEnum';
import { forLoop } from './def/forLoop';
import { OutputVarCommandBase } from './def/OutputVarCommandBase';
import { OutputVarCommandPlus } from './def/OutputVarCommandPlus';
import { varSetCapacityFunc } from './def/varSetCapacityFunc';
import { walrusOperator } from './def/walrusOperator';
import type { TGetFnDefNeed } from './TFnVarDef';

export function getFnVarDef(
    startLine: number,
    endLine: number,
    DocStrMap: TTokenStream,
    paramMap: TParamMapIn,
    GValMap: TGValMap,
): TValMapIn {
    const valMap: TValMapIn = new Map<string, TValMetaIn>();
    for (
        const {
            lStr,
            line,
            lineComment,
            fistWordUp,
        } of DocStrMap
    ) {
        if (line <= startLine) continue; // in arg Range
        if (line > endLine) break;

        const lStrTrimLen: number = lStr.trim().length;
        if (lStrTrimLen < 2) continue; // a=b need length >=3

        const need: TGetFnDefNeed = {
            lStr,
            valMap,
            line,
            paramMap,
            GValMap,
            lStrTrimLen,
            lineComment,
        };
        walrusOperator(need); // :=
        varSetCapacityFunc(need); // VarSetCapacity(varName) or NumGet(varName) or NumGet(&varName)
        forLoop(need); // for var1 , var2 in
        OutputVarCommandBase(need, fistWordUp);
        OutputVarCommandPlus(need, fistWordUp);

        // not plan to support this case....
        // DllCall("DllFile\Function" , Type1, Arg1, Type2, Arg2, "Cdecl ReturnType")
        // ----------------------------------------------------------------^
        // FoundPos := RegExMatch(Haystack, NeedleRegEx , OutputVar, StartingPos := 1)
        // --------------------------------------------------^
        // New GUI options: +HwndOutputVar, +ParentGUI
        //                     ^ ...WTF?
    }

    return valMap;
}
