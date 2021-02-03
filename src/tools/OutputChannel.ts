// import * as fs from 'fs';
import * as vscode from 'vscode';

const channel = vscode.window.createOutputChannel('AHK(Neko-help)');
export const OutputChannel = {
    log(message: string): void {
        channel.appendLine(message);
        channel.show(true);
    },
    err(message: string, err: NodeJS.ErrnoException): void {
        console.log('OutputChannel -> err -> val', err);
        channel.appendLine(message);
        channel.show(true);
    },
};
