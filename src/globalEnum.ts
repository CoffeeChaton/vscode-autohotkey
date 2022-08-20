/* eslint-disable no-magic-numbers */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export const enum EDetail {
    inComment = 3,
    inSkipSign2 = 4,
    deepAdd = 5,
    deepSubtract = 6,
    isGlobalLine = 7,
    hasDoubleSemicolon = 8,
}

export const enum ELTrim {
    none = 0,
    FlagS = 1,
    FlagM = 2,
    FlagE = 3,
    noFlagS = 11,
    noFlagM = 12,
    noFlagE = 13,
}

export const enum EDiagDeep {
    none = 0,
    multL = 1, // multiple opening braces "{"
    multR = 2, // multiple closing braces "}"
}

export type TAhkTokenLine = DeepReadonly<{
    fistWordUp: string;
    lStr: string;
    textRaw: string;
    deep: number;
    detail: readonly EDetail[];
    line: number;
    LTrim: ELTrim;
    cll: 0 | 1;
    lineComment: string;
    diagDeep: EDiagDeep;
    displayErr: boolean;
    displayFnErr: boolean;
    // I know this is not Complete and correct Token.
}>;

export type TAhkToken = TAhkTokenLine[];

export type TTokenStream = DeepReadonly<TAhkToken>;

export type TFsPath = string; // vscode.uru.fsPath

export const enum EFormatChannel {
    byFormatAllFile = 'Format File',
    byFormatRange = 'Format Range',
    byFormatOnType = 'Format OnType',
    // byDev = 'wait for dev',
}
