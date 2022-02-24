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

export type TArgAnalysis = {
    keyRawName: string;
    defLoc: vscode.Location[];
    refLoc: vscode.Location[];

    isByRef: boolean;
    isVariadic: boolean;
};
export type TArgMap = Map<string, TArgAnalysis>; // k = valNameUP

export type TGetFnDefNeed = {
    lStr: string;
    valMap: TValMap;
    line: number;
    lineType: TAhkValType;
    uri: vscode.Uri;
    argMap: TArgMap;
    diagVal: vscode.Diagnostic[];
    warnNumber: [number];
};

export type TValAnalysis = {
    keyRawName: string;
    defLoc: vscode.Location[];
    refLoc: vscode.Location[];

    ahkValType: TAhkValType;
    code502Warn: number; // about code502 available // TODO config -> codeWarnMax now is 3
};
export type TValMap = Map<string, TValAnalysis>; // k = valNameUP
export type TTextAnalysis = {
    keyRawName: string;
    refLoc: vscode.Location[];
};

export type TTextMap = Map<string, TTextAnalysis>; // k = valNameUP
export type DeepAnalysisResult = {
    argMap: TArgMap;
    valMap: TValMap;
    textMap: TTextMap;
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
