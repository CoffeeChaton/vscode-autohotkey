/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';

export const enum EMode {
    // ahkVoid = 'void',
    ahkFunc = 'Function',
    ahkClass = 'Class',
    ahkMethod = 'Method',
    // ahkAll = 'ahkAll',
    ahkGlobal = 'global',
}

// vscode.SymbolKind
// enum SymbolKind {
//     Class = 4,
//     Method = 5,
//     Function = 11,
//     Variable = 12,
// }

export const enum EStr {
    diff_name_prefix = '_diff_temp_',
    suggestStr = '✿',
    neverStr = '▽',
}
export const enum EUri {
    ahkDoc = 'https://www.autohotkey.com/docs/',
    nekoHelpHome = 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp',
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export const enum DetailType {
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
    readonly lStr: string;
    readonly textRaw: string;
    readonly deep: number;
    readonly detail: readonly DetailType[];
    readonly line: number;
    // I know this is not Complete and correct Token.
}[];
export type TTokenStream = DeepReadonly<TAhkToken>;
export type TAhkSymbol = DeepReadonly<vscode.DocumentSymbol>;
export type TAhkSymbolList = DeepReadonly<vscode.DocumentSymbol[]>;

export type TSymAndFsPath = {
    ahkSymbol: TAhkSymbol;
    fsPath: string;
};

export type TGlobalVal = {
    lRange: vscode.Range; // left Range
    rVal: string | null; // Right value is textRaw
    rawName: string; //
};
export type TValUpName = string;
export type TGValMap = Map<TValUpName, TGlobalVal[]>;

export const enum VERSION {
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
export type TAhkValType = EValType.local | EValType.global | EValType.Static;

/**
 * if keyRawName = first def name
 *  -> 0
 *  -> string
 */
export type TC502New = (0 | string);
export type TArgAnalysis = {
    keyRawName: string;
    defLocList: vscode.Location[]; // TODO diags "Duplicate parameter".
    refLocList: vscode.Location[];
    c502Array: TC502New[];

    isByRef: boolean;
    isVariadic: boolean; // https://www.autohotkey.com/docs/Functions.htm#Variadic  // TODO DIAG *is last
};
export type TArgMap = Map<string, TArgAnalysis>; // k = valNameUP

export type TGetFnDefNeed = {
    lStr: string;
    valMap: TValMap;
    line: number;
    lineType: TAhkValType;
    uri: vscode.Uri;
    argMap: TArgMap;
};

export type TValAnalysis = {
    keyRawName: string;
    defLocList: vscode.Location[];
    refLocList: vscode.Location[];
    c502Array: TC502New[];

    ahkValType: TAhkValType;
};
export type TValMap = Map<string, TValAnalysis>; // k = valNameUP
export type TParamOrValMap = TValMap | TArgMap;
export type TTextAnalysis = {
    keyRawName: string;
    refLoc: vscode.Location[];
};

export type TTextMap = Map<string, TTextAnalysis>; // k = valNameUP
export type DeepAnalysisResult = {
    argMap: TArgMap;
    valMap: TValMap;
    textMap: TTextMap;
    funcRawName: string;
};

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
    Ignored: {
        folder: {
            startsWith: string[];
            endsWith: string[];
        };
        File: {
            startsWith: string[];
            endsWith: string[];
        };
    };
    Debug: {
        executePath: string;
    };
    snippets: {
        intelligent: boolean;
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

// foo<T>(a: NonNullable<T>)

export const enum TFormatChannel {
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

export const enum ETime {
    SnippetStartWihA = 5000, // delay 5 sec
}

export const enum ESnippetRecBecause {
    paramNeverUsed = 'param is assigned but never used.\n\n',
    paramStartWith = 'param start with(Case Sensitive)\n\n',
    varDefNear = 'Def within the 5 lines\n\n',
    varRefNear = 'Ref within the 5 lines\n\n',
    varStartWith = 'var start with(Case Sensitive)\n\n',
}

export type TKeyRawName = string;
export type TSnippetRecMap = Map<TKeyRawName, ESnippetRecBecause>;
