/* eslint-disable no-magic-numbers */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

export const enum EDetail {
    inComment = 3,
    inSkipSign2 = 4,
    deepAdd = 5,
    deepSubtract = 6,
    hasDoubleSemicolon = 8,
}

export const enum EMultiline {
    // https://www.autohotkey.com/docs/Scripts.htm#continuation-section
    none = 0,
    start = 1,
    mid = 2,
    end = 3,
}

export type TPos = DeepReadonly<{
    col: number;
    len: number;
}>;

export type TMultilineFlag =
    | DeepReadonly<{
        Join: TPos[];
        LTrim: TPos[];
        RTrim0: TPos[];
        CommentFlag: TPos[]; // C
        Percent: TPos[]; // %
        comma: TPos[]; // ,
        accent: TPos[]; // `
        // ---
        unknown: TPos[];
        L: number; // (
        R: number; // ;

        //
        blockLineStart: number;
        blockLineEnd: number;
        /**
         * false : end with ')'
         * true : end with ')' and '#' expression syntax (recommended):
         */
        isExpress: boolean;
    }>
    | null;

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
    multiline: EMultiline;
    multilineFlag: TMultilineFlag;
    cll: 0 | 1;
    lineComment: string;
    diagDeep: EDiagDeep;
    displayErr: boolean;
    displayFnErr: boolean;
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
