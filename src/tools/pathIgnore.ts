/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as mm from 'micromatch';
import * as vscode from 'vscode';

export function pathIgnore(fsPath: string): boolean {
    // TODO replace of fsPathHead
    const Uri = vscode.Uri.file(fsPath);
    const p0 = Uri.path;

    const pattern: readonly string[] = ['**/Gdip*.ahk']; // TODO like .gitignore
    return mm.isMatch(p0, pattern);
}
