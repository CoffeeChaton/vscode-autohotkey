import * as vscode from 'vscode';

export const OutputChannel = vscode.window.createOutputChannel('AHK Neko Help', 'log');

let fmtChannel: vscode.OutputChannel | null = null;
export const OutputFormatChannel = {
    appendLine(value: string): void {
        if (fmtChannel === null) {
            fmtChannel = vscode.window.createOutputChannel('AHK Neko Help [Format-log]', 'log');
            fmtChannel.appendLine(`[${(new Date()).toLocaleString()}] fmtChannel start `);
        }
        fmtChannel.appendLine(value);
    },
};
