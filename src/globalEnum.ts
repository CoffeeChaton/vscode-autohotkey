/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
import * as vscode from 'vscode';

export const enum EMode {
    ahkVoid = 'void',
    ahkFunc = 'Function',
    ahkClass = 'Class',
    ahkMethod = 'Method',
    ahkAll = 'ahkAll',
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
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export const enum DetailType {
    inComment = 'c',
    inLTrim0 = 0,
    inLTrim1 = 1,
    inLTrim2 = 2,
    inSkipSign = 'Sk',
    inSkipSign2 = 'Sk2',
    deepAdd = '+',
    deepSubtract = '-',
}

export type TAhkToken = {
    readonly lStr: string;
    readonly textRaw: string;
    readonly deep: number;
    readonly detail: readonly DetailType[];
    readonly line: number;
    // i know this is not Complete and correct Token.
}[];
export type TTokenStream = DeepReadonly<TAhkToken>;
export type TAhkSymbol = DeepReadonly<vscode.DocumentSymbol>;
export type TAhkSymbolList = DeepReadonly<vscode.DocumentSymbol[]>;
// export type TAhkSymbol = Readonly<vscode.DocumentSymbol>;
// export type TAhkSymbolList = Readonly<Readonly<vscode.DocumentSymbol>[]>;
export type TSymAndFsPath = { ahkSymbol: TAhkSymbol; fsPath: string; };

export type TValArray = {
    lRange: vscode.Range, // left Range
    rVal: string | null; // Right value as textRaw
}[];
export type TValName = string;
export type TGValMap = Map<TValName, TValArray>;

export const enum VERSION {
    getValDefInFunc = '0.4beta',
    format = 'v0.48',
    formatRange = ' v0.4a',
}
export const enum EDiagBase {
    ignore = ';@ahk-ignore ', // ;@ahk-ignore 30 line.
    source = 'neko help',
}
export const enum EDiagCode {
    code107 = 107,
    code110 = 110, // 100~110 is switch err
    code111 = 111,
    code112 = 112,
    code113 = 113,
    code114 = 114,
    code201 = 201, // 200~299 is not expression // need use %
    code301 = 301, // 300~399 is func err
    code700 = 700, // 700 is Command -> func
    // code701 = 701, // 701~799 is Command error
    code801 = 801, // 800~899 is Deprecated / Old Syntax
    code802 = 802,
    code901 = 901, // 901~999 is not recommended
    code902 = 902,
    code903 = 903,
}
export const enum EDiagMsg {
    code107 = 'assign warning',
    code110 = 'default : not find ',
    code111 = 'default : too much ',
    code112 = 'Case : > 20',
    code113 = 'Case : not find ',
    code114 = 'switch name not find',
    code201 = 'Count cannot be an expression, use %',
    code301 = 'function or Method is so big',
    code700 = 'try to use function replace Command(obsolete code)',
    code801 = 'Old Syntax(obsolete code)',
    code802 = 'Old Syntax(obsolete code)',
    code901 = 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work.',
    code902 = 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work.',
    code903 = 'ahk-doc not recommended and ahk-neko-help Syntax highlighting is not work.',
}
export const enum EDiagFsPath {
    code107 = 'https://www.autohotkey.com/docs/commands/SetEnv.htm',
    code110 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code111 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code112 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code113 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code114 = 'https://www.autohotkey.com/docs/commands/Switch.htm',
    code201 = 'https://www.autohotkey.com/docs/commands/Loop.htm',
    code301 = 'function or Method is so big',
    code700 = 'https://www.autohotkey.com/docs/Language.htm#commands-vs-functions',
    code801 = 'https://www.autohotkey.com/docs/commands/LoopReg.htm#old',
    code802 = 'https://www.autohotkey.com/docs/commands/LoopFile.htm#old',
    code901 = 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm',
    code902 = 'https://www.autohotkey.com/docs/commands/_CommentFlag.htm',
    code903 = 'https://www.autohotkey.com/docs/commands/_EscapeChar.htm#Related',
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
export type TGetDefType = { fnMode: EFnMode; DocStrMap: TTokenStream; regex: RegExp; ahkSymbol: TAhkSymbol; word: string; };
export type TGetTypeInput = { DocStrMap: TTokenStream; regex: RegExp; ahkSymbol: TAhkSymbol; };
export type TMapLineType = Map<number, EValType.local | EValType.global | EValType.Static>; // Map<line,ahkType>
export type TArgListVal = {
    keyRawName: string;
    defLoc: vscode.Location[];
    refLoc: vscode.Location[];
    commentList: string[];

    isByRef: boolean;
    isVariadic: boolean;
};
export type TArgList = Map<string, TArgListVal>; // k = valNameUP
export type TValObj = {
    keyRawName: string;
    defLoc: vscode.Location[];
    refLoc: vscode.Location[];
    commentList: string[];
    ahkValType: TAhkValType;
};
export type TValMap = Map<string, TValObj>; // k = valNameUP
export type DeepAnalysisResult = {
    argMap: TArgList;
    valMap: TValMap;
};
export const enum TAhkSymbolRange {
    argsRange = 2,
    fullRange = 1,

    selectRange = 3,
    bodyRange = 4,
}

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
};
export type TConfigs = DeepReadonly<TempConfigs>;
// foo<T>(a: NonNullable<T>)
