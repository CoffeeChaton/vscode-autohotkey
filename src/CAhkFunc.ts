import * as vscode from 'vscode';
import { DeepReadonly } from './globalEnum';

// ---------------------------------------------------------------------------
// WTF
// ---------------------------------------------------------------------------
type TUpName = string;
/**
 * if keyRawName = first def name -> 0
 * ; else -> string
 */
export type TC502New = (0 | string);

export type TParamMetaIn = {
    keyRawName: string;
    defRangeList: vscode.Range[]; // TODO diags "Duplicate parameter". or TODO no-param-reassign
    refRangeList: vscode.Range[];
    c502Array: TC502New[];

    isByRef: boolean;
    isVariadic: boolean; // https://www.autohotkey.com/docs/Functions.htm#Variadic
};
export type TParamMetaOut = DeepReadonly<TParamMetaIn>;

export type TParamMapIn = Map<TUpName, TParamMetaIn>; // k = valNameUP

export type TParamMapOut = ReadonlyMap<TUpName, TParamMetaOut>; // k = valNameUP

export type TValMetaIn = {
    keyRawName: string;
    defRangeList: vscode.Range[];
    refRangeList: vscode.Range[];
    c502Array: TC502New[];
};
export type TValMetaOut = DeepReadonly<TValMetaIn>;

export type TValMapIn = Map<TUpName, TValMetaIn>; // k = valNameUP

export type TValMapOut = ReadonlyMap<TUpName, TValMetaOut>; // k = valNameUP

export type TTextMetaIn = {
    keyRawName: string;
    refRangeList: vscode.Range[];
};
export type TTextMetaOut = DeepReadonly<TTextMetaIn>;

export type TTextMapIn = Map<TUpName, TTextMetaIn>; // k = valNameUP

export type TTextMapOut = ReadonlyMap<TUpName, TTextMetaOut>; // k = valNameUP

type MyDocArg = {
    name: string;
    detail: string;
    kind: vscode.SymbolKind;
    range: vscode.Range;
    selectionRange: vscode.Range;
    //
    selectionRangeText: string;
    md: vscode.MarkdownString;
    uri: vscode.Uri;
    defStack: string[]; // TODO method defStack
    paramMap: TParamMapOut;
    valMap: TValMapOut;
    textMap: TTextMapOut;
    children: vscode.DocumentSymbol[];
};

// AH instanceof CAhkFunc

export class CAhkFunc extends vscode.DocumentSymbol {
    public readonly nameRange: vscode.Range;
    public readonly selectionRangeText: string;
    public readonly md: vscode.MarkdownString;
    public readonly uri: vscode.Uri;
    public readonly upName: string;
    public readonly paramMap: TParamMapOut;
    public readonly valMap: TValMapOut;
    public readonly textMap: TTextMapOut;
    public readonly defStack: string[];
    //
    declare public kind: vscode.SymbolKind.Function | vscode.SymbolKind.Method;
    declare public children: vscode.DocumentSymbol[];

    public constructor(
        {
            name,
            detail,
            kind,
            range,
            selectionRange,
            selectionRangeText,
            md,
            uri,
            defStack,
            paramMap,
            valMap,
            textMap,
            children,
        }: MyDocArg,
    ) {
        super(name, detail, kind, range, selectionRange);
        this.selectionRangeText = selectionRangeText;
        this.upName = name.toUpperCase();
        this.md = md;
        this.uri = uri;
        this.defStack = defStack;
        this.paramMap = paramMap;
        this.valMap = valMap;
        this.textMap = textMap;
        this.children = children;

        this.nameRange = new vscode.Range(
            selectionRange.start,
            new vscode.Position(
                selectionRange.start.line,
                selectionRangeText.indexOf('('),
            ),
        );
    }
}
