/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as mm from 'micromatch';
import * as vscode from 'vscode';

export function pathIgnore(fsPath: string): boolean {
    // TODO replace of fsPathHead
    const Uri = vscode.Uri.file(fsPath);
    const p0 = Uri.path;

    const pattern: readonly string[] = ['**/Gdip*.ahk']; // TODO like glob
    return mm.isMatch(p0, pattern);
}

// eslint-disable-next-line no-irregular-whitespace
// vscode.languages.findFiles('**​/*.js', '**​/node_modules/**')
// vscode.languages.match
// TODO OutputChannel of user setting of pathIgnore <--> getConfig
// https://code.visualstudio.com/api/references/vscode-api#GlobPattern
