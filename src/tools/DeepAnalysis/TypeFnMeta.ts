import * as vscode from 'vscode';
import { DeepReadonly } from '../../globalEnum';

type TUpName = string;
/**
 * if keyRawName = first def name -> 0
 * ; else -> string
 */
export type TC502New = (0 | string);
export type TParamMeta = {
    keyRawName: string;
    defRangeList: vscode.Range[]; // TODO diags "Duplicate parameter". or TODO no-param-reassign
    refRangeList: vscode.Range[];
    c502Array: TC502New[];

    isByRef: boolean;
    isVariadic: boolean; // https://www.autohotkey.com/docs/Functions.htm#Variadic
};
export type TParamMap = Map<TUpName, TParamMeta>; // k = valNameUP

export type TValMeta = {
    keyRawName: string;
    defRangeList: vscode.Range[];
    refRangeList: vscode.Range[];
    c502Array: TC502New[];
};
export type TValMap = Map<TUpName, TValMeta>; // k = valNameUP

export type TTextMeta = {
    keyRawName: string;
    refRangeList: vscode.Range[];
};

export type TTextMap = Map<TUpName, TTextMeta>; // k = valNameUP

export type TDAMeta = DeepReadonly<{
    kind: vscode.SymbolKind.Method | vscode.SymbolKind.Function;
    paramMap: TParamMap;
    valMap: TValMap;
    textMap: TTextMap;
    funcRawName: string;
    upName: string;
    selectionRangeText: string;
    range: vscode.Range; // copy ?
    uri: vscode.Uri;
    md: vscode.MarkdownString;
}>;
