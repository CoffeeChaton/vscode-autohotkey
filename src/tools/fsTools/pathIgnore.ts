/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as mm from 'micromatch';

export function pathIgnore(fsPath: string): boolean {
    const pattern: readonly string[] = ['**/Gdip*.ahk']; // TODO like glob
    return mm.isMatch(fsPath, pattern);
}

// TODO OutputChannel of user setting of pathIgnore <--> getConfig
// https://code.visualstudio.com/api/references/vscode-api#GlobPattern
