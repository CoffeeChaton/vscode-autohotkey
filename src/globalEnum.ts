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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // I know this is not Complete and correct Token.
}[];
export type TTokenStream = DeepReadonly<TAhkToken>;
export type TAhkSymbol = DeepReadonly<vscode.DocumentSymbol>;
export type TAhkSymbolList = DeepReadonly<vscode.DocumentSymbol[]>;

export type TSymAndFsPath = {
    ahkSymbol: TAhkSymbol;
    fsPath: string;
};

export type TValArray = {
    lRange: vscode.Range; // left Range
    rVal: string | null; // Right value is textRaw
}[];
export type TValName = string;
export type TGValMap = Map<TValName, TValArray>;

export const enum VERSION {
    getValDefInFunc = '0.4beta',
    format = 'v0.5',
    formatRange = ' v0.4b',
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
    code501 = 501, // 501~599 Analysis Func or Method
    code700 = 700, // 700 is Command -> func
    // code701 = 701, // 701~799 is Command error
    // 800~899 is Deprecated / Old Syntax
    code801 = 801,
    code802 = 802,
    code803 = 803,
    code804 = 804,
    code805 = 805,
    code806 = 806,
    code807 = 807,
    code808 = 808,
    code809 = 809,
    code810 = 810,
    code811 = 811,
    code812 = 812,
    code813 = 813,
    code814 = 814,
    code815 = 815,
    code816 = 816,
    code817 = 817,
    code818 = 818,
    code819 = 819,
    code820 = 820,
    code821 = 821,
    code822 = 822,
    code823 = 823,
    code824 = 824,
    // 901~999 is not recommended
    code901 = 901,
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
    code501 = 'args is assigned but never used.',
    code700 = 'try to use function replace Command(obsolete code)',
    code801 = 'Old Syntax(obsolete code)',
    code802 = 'Old Syntax(obsolete code)',
    code803 = 'Use `Var := Var / Value` or `Var /= Value` instead.',
    code804 = 'Use `Var := Var * Value` or `Var *= Value` instead.',
    code805 = 'Use the `GetKeyState()` function instead.',
    code806 = 'Use `If (expression)` instead.',
    code807 = 'Use the `FileExist()` function instead.',
    code808 = 'Use the `InStr()` function instead.',
    code809 = 'Use the `WinActive()` function instead.',
    code810 = 'Use the `WinExist()` function instead.',
    code811 = 'Use the `OnClipboardChange()` function instead.',
    code812 = 'Use the `OnExit()` function instead.',
    code813 = 'Use the `Gui,` command instead.',
    code814 = 'Use expression assignments like `Var := Value` instead.',
    code815 = 'Use the `Format()` function instead.',
    code816 = 'Use the `Gui` command instead.',
    code817 = 'Use the `InStr()` function instead.',
    code818 = 'Use the `SubStr()` function instead.',
    code819 = 'Use the `StrLen()` function instead.',
    code820 = 'Use the `SubStr()` function instead.',
    code821 = 'Use the `StrReplace()` function instead.',
    code822 = 'Use the `StrSplit()` function instead.',
    code823 = 'Use the `SubStr()` function instead.',
    code824 = 'Deprecated: This command is not recommended for use in new scripts.',
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
    code501 = 'args is assigned but never used.',
    code700 = 'https://www.autohotkey.com/docs/Language.htm#commands-vs-functions',
    code801 = 'https://www.autohotkey.com/docs/commands/LoopReg.htm#old',
    code802 = 'https://www.autohotkey.com/docs/commands/LoopFile.htm#old',
    code803 = 'https://www.autohotkey.com/docs/commands/EnvDiv.htm',
    code804 = 'https://www.autohotkey.com/docs/commands/EnvMult.htm',
    code805 = 'https://www.autohotkey.com/docs/commands/GetKeyState.htm#command',
    code806 = 'https://www.autohotkey.com/docs/commands/IfEqual.htm',
    code807 = 'https://www.autohotkey.com/docs/commands/IfExist.htm',
    code808 = 'https://www.autohotkey.com/docs/commands/IfInString.htm',
    code809 = 'https://www.autohotkey.com/docs/commands/IfWinActive.htm',
    code810 = 'https://www.autohotkey.com/docs/commands/IfWinExist.htm',
    code811 = 'https://www.autohotkey.com/docs/commands/OnClipboardChange.htm#label',
    code812 = 'https://www.autohotkey.com/docs/commands/OnExit.htm#command',
    code813 = 'https://www.autohotkey.com/docs/commands/Progress.htm',
    code814 = 'https://www.autohotkey.com/docs/commands/SetEnv.htm',
    code815 = 'https://www.autohotkey.com/docs/commands/SetFormat.htm',
    code816 = 'https://www.autohotkey.com/docs/commands/SplashTextOn.htm',
    code817 = 'https://www.autohotkey.com/docs/commands/StringGetPos.htm',
    code818 = 'https://www.autohotkey.com/docs/commands/StringLeft.htm',
    code819 = 'https://www.autohotkey.com/docs/commands/StringLen.htm',
    code820 = 'https://www.autohotkey.com/docs/commands/StringMid.htm',
    code821 = 'https://www.autohotkey.com/docs/commands/StringReplace.htm',
    code822 = 'https://www.autohotkey.com/docs/commands/StringSplit.htm',
    code823 = 'https://www.autohotkey.com/docs/commands/StringTrimLeft.htm',
    code824 = 'https://www.autohotkey.com/docs/commands/Transform.htm',
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
export type TGetDefType = {
    fnMode: EFnMode;
    DocStrMap: TTokenStream;
    regex: RegExp;
    ahkSymbol: TAhkSymbol;
    word: string;
};
export type TGetTypeInput = {
    DocStrMap: TTokenStream;
    regex: RegExp;
    ahkSymbol: TAhkSymbol;
};
export type TMapLineType = Map<number, EValType.local | EValType.global | EValType.Static>; // Map<line,ahkType>
export type TArgAnalysis = {
    keyRawName: string;
    defLoc: vscode.Location[];
    refLoc: vscode.Location[];
    commentList: string[];

    isByRef: boolean;
    isVariadic: boolean;
};
export type TArgMap = Map<string, TArgAnalysis>; // k = valNameUP
export type TValAnalysis = {
    keyRawName: string;
    defLoc: vscode.Location[];
    refLoc: vscode.Location[];
    commentList: string[];
    ahkValType: TAhkValType;
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
    snippets: {
        intelligent: boolean;
    };
};
export type TConfigs = DeepReadonly<TempConfigs>;

// foo<T>(a: NonNullable<T>)

export const enum TFormatChannel {
    byFormatAllFile = 'Format File',
    byFormatRange = 'Format Range',
    byFormatOnType = 'Format OnType',
    byDev = 'wait for dev',
}

export type TPick<TNeed> = {
    label: string;
    fn: () => Promise<TNeed>;
} | {
    label: string;
    fn: () => TNeed;
};
