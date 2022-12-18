/* eslint-disable no-magic-numbers */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

// type NonNullable<T> = Exclude<T, null | undefined>; // Remove null and undefined from T

export type NonNull<T> = Exclude<T, null>;

export const enum EDetail {
    inComment = 3,
    inSkipSign2 = 4,
    deepAdd = 5,
    deepSubtract = 6,
    hasDoubleSemicolon = 8,
}

/**
 * https://www.autohotkey.com/docs/Scripts.htm#continuation-section
 */
export const enum EMultiline {
    none = 0,
    start = 1,
    mid = 2,
    end = 3,
}

export type TPos = Readonly<{
    col: number;
    len: number;
}>;

/**
 * https://www.autohotkey.com/docs/Scripts.htm#continuation-section
 */
export type TMultilineFlag =
    | DeepReadonly<{
        Join: TPos[]; // https://www.autohotkey.com/docs/Scripts.htm#Join
        LTrim: TPos[]; // https://www.autohotkey.com/docs/Scripts.htm#LTrim
        RTrim0: TPos[];
        CommentFlag: TPos[]; // C
        PercentFlag: TPos[]; // %
        commaFlag: TPos[]; // ,
        accentFlag: TPos[]; // `
        // ---
        unknownFlag: TPos[];
        L: number; // (
        R: number; // ;

        /**
         * false : end with ')'
         * true : end with ')' and '#' expression syntax (recommended):
         */
        isExpress: boolean;
    }>
    | null;

export type TAhkTokenLine = DeepReadonly<{
    fistWordUpCol: number;
    fistWordUp: string;
    SecondWordUp: string;
    SecondWordUpCol: number;
    lStr: string;
    textRaw: string;
    deep: number;
    detail: readonly EDetail[];
    line: number;
    multiline: EMultiline;
    multilineFlag: TMultilineFlag;
    cll: 0 | 1;
    lineComment: string;
    displayErr: boolean;
    displayFnErr: boolean;
    ahkDoc: string;
    // I know this is not Complete and correct Token.
}>;

export type TAhkToken = TAhkTokenLine[];

export type TTokenStream = readonly TAhkTokenLine[];

export type TFsPath = string; // vscode.uru.fsPath

export const enum EFormatChannel {
    byFormatAllFile = 'Format File',
    byFormatRange = 'Format Range',
    byFormatOnType = 'Format OnType',
    // byDev = 'wait for dev',
}

// https://github.com/modfy/nominal
