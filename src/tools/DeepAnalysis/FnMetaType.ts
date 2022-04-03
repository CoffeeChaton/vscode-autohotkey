import * as vscode from 'vscode';
import { EValType } from '../../globalEnum';

export type TAhkValType = EValType.local | EValType.global | EValType.Static;
/**
 * if keyRawName = first def name -> 0
 * ; else -> string
 */
export type TC502New = (0 | string);
export type TArgAnalysis = {
    keyRawName: string;
    defRangeList: vscode.Range[]; // TODO diags "Duplicate parameter". or TODO no-param-reassign
    refRangeList: vscode.Range[];
    c502Array: TC502New[];

    isByRef: boolean;
    isVariadic: boolean; // https://www.autohotkey.com/docs/Functions.htm#Variadic
};
export type TArgMap = Map<string, TArgAnalysis>; // k = valNameUP

export type TGetFnDefNeed = {
    lStr: string;
    valMap: TValMap;
    line: number;
    lineType: TAhkValType;
    argMap: TArgMap;
};

export type TValAnalysis = {
    keyRawName: string;
    defRangeList: vscode.Range[];
    refRangeList: vscode.Range[];
    c502Array: TC502New[];

    ahkValType: TAhkValType;
};
export type TValMap = Map<string, TValAnalysis>; // k = valNameUP
export type TParamOrValMap = TValMap | TArgMap;
export type TTextAnalysis = {
    keyRawName: string;
    refRangeList: vscode.Range[];
};

export type TTextMap = Map<string, TTextAnalysis>; // k = valNameUP
export type TDeepAnalysisMeta = {
    argMap: TArgMap;
    valMap: TValMap;
    textMap: TTextMap;
    funcRawName: string;
};
