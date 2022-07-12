/* eslint-disable no-magic-numbers */

// export const enum EUri {
//     ahkDoc = 'https://www.autohotkey.com/docs/',
//     nekoHelpHome = 'https://github.com/CoffeeChaton/vscode-autohotkey-NekoHelp',
// }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DeepReadonly<T> = T extends (...args: any) => any ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

export const enum EDetail {
    inComment = 3,
    inLTrim1 = 1, // FIXME LTrim with ) end
    inLTrim2 = 2,
    inSkipSign2 = 4,
    deepAdd = 5,
    deepSubtract = 6,
    isGlobalLine = 7,
    hasDoubleSemicolon = 8,
}

export type TAhkToken = {
    readonly fistWordUp: string;
    readonly lStr: string;
    readonly textRaw: string;
    readonly deep: number;
    readonly detail: readonly EDetail[];
    readonly line: number;
    readonly cll: 0 | 1;
    readonly lineComment: string;
    // I know this is not Complete and correct Token.
}[];
export type TTokenStream = DeepReadonly<TAhkToken>;

export type TFsPath = string; // vscode.uru.fsPath

export const enum EFormatChannel {
    byFormatAllFile = 'Format File',
    byFormatRange = 'Format Range',
    byFormatOnType = 'Format OnType',
    // byDev = 'wait for dev',
}
