/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';

export const enum EMode {
    // ahkVoid = 'void',
    ahkFunc = 'Function', // vscode.SymbolKind.Function
    ahkClass = 'Class', // vscode.SymbolKind.Class
    ahkMethod = 'Method', // vscode.SymbolKind.Method
    // ahkAll = 'ahkAll',
    ahkGlobal = 'global', // vscode.SymbolKind.Variable
}

// vscode.SymbolKind
// enum ESymbolKind {
//     Class = 4,
//     Method = 5,
//     Function = 11,
//     Variable = 12,
// }

export const enum EStr {
    diff_name_prefix = '_diff_temp_',
    suggestStr = '✿',
    // neverStr = '▽',
}

// export const enum EUri {
//     ahkDoc = 'https://www.autohotkey.com/docs/',
//     nekoHelpHome = 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp',
// }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export const enum EDetail {
    inComment = 3,
    // inLTrim0 = 0,
    inLTrim1 = 1,
    inLTrim2 = 2,
    // inSkipSign = 'Sk',
    inSkipSign2 = 4,
    deepAdd = 5,
    deepSubtract = 6,
}

export type TAhkToken = {
    readonly fistWordUp: string;
    readonly lStr: string;
    readonly textRaw: string;
    readonly deep: number;
    readonly detail: readonly EDetail[];
    readonly line: number;
    // I know this is not Complete and correct Token.
}[];
export type TTokenStream = DeepReadonly<TAhkToken>;

export type TFsPath = string; // vscode.uru.fsPath

export type TSymAndFsPath = {
    AhkSymbol: TAhkSymbol;
    fsPath: TFsPath;
};

export const enum EVersion {
    getValDefInFunc = '0.4beta',
    format = 'v0.5',
    formatRange = ' v0.4b',
}

export const enum EDiagBase {
    ignore = ';@ahk-ignore ', // ;@ahk-ignore 30 line.
    source = 'neko help',
    sourceDA = 'neko help(DA)',
}

export const enum EFnMode {
    normal = 1,
    local = 2,
    global = 3,
    Static = 4,
}

export const enum EValType {
    normal = 1,
    local = 2,
    global = 3,
    Static = 4,
    args = 5,
}

export type TRunValType = Exclude<EValType, EValType.normal>;
export type TRunValType2 = Exclude<TRunValType, EValType.args>;

type TempConfigs = {
    statusBar: {
        displayColor: string;
    };
    format: {
        textReplace: boolean;
    };
    lint: {
        funcSize: number;
    };
    baseScan: {
        IgnoredList: readonly string[];
    };
    Debug: {
        executePath: string;
    };
    snippets: {
        blockFilesList: readonly string[];
    };
    Diag: {
        WarningCap: {
            code502: number; // of var
            code503: number; // of param
        };
    };
    openUriStr: string; //
};
export type TConfigs = DeepReadonly<TempConfigs>;

export const enum EFormatChannel {
    byFormatAllFile = 'Format File',
    byFormatRange = 'Format Range',
    byFormatOnType = 'Format OnType',
    // byDev = 'wait for dev',
}

export type TPick<TNeed> = {
    label: string;
    fn: () => Promise<TNeed>;
} | {
    label: string;
    fn: () => TNeed;
};

export const enum ESnippetRecBecause {
    paramNeverUsed = 'param is assigned but never used.\n\n',
    paramStartWith = 'param start with(Case Sensitive)\n\n',
    varDefNear = 'Def within the 5 lines\n\n',
    varRefNear = 'Ref within the 5 lines\n\n',
    varStartWith = 'var start with(Case Sensitive)\n\n',
}

export type TKeyRawName = string;
export type TSnippetRecMap = Map<TKeyRawName, ESnippetRecBecause>;

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
export class MyClassDoc extends vscode.DocumentSymbol {
    public selectionRangeText: string;
    public md: vscode.MarkdownString;
    public uri: vscode.Uri;
    public upName: string;
    public paramMap: TParamMap;
    public valMap: TValMap;
    public textMap: TTextMap;
    public defStack: string[];
    declare public children: vscode.DocumentSymbol[];
    // eslint-disable-next-line max-params
    public constructor(
        name: string,
        detail: string,
        kind: vscode.SymbolKind,
        range: vscode.Range,
        selectionRange: vscode.Range,
        //
        selectionRangeText: string,
        md: vscode.MarkdownString,
        uri: vscode.Uri,
        defStack: string[],
        paramMap: TParamMap,
        valMap: TValMap,
        textMap: TTextMap,
        children: vscode.DocumentSymbol[],
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
    }
}
export type TAhkSymbol = DeepReadonly<vscode.DocumentSymbol | MyClassDoc>;
export type TAhkSymbolList = DeepReadonly<TAhkSymbol[]>;
