import * as fs from 'fs';
import * as vscode from 'vscode';

export function checkDebugFile(executePath: string): void {
    fs.access(executePath, (err: NodeJS.ErrnoException | null): void => {
        if (err === null) return;
        const errCode = err.message
            ? ` <---> err.message ${err.message}`
            : '';
        const msg = `setting err of "AhkNekoHelp.Debug.executePath" : "${executePath}"${errCode}`;
        void vscode.window.showErrorMessage(msg);
        const msg2 = `can't find the file at "${executePath}"`;
        void vscode.window.showErrorMessage(msg2);
    });
}
