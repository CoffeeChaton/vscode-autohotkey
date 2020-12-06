// import * as fs from 'fs';
import * as vscode from 'vscode';

export const Out = {
    channel: vscode.window.createOutputChannel('AHK'),
    log(value: NodeJS.ErrnoException): void {
        const val = `readdir err at Out.ts line--19--167, ${value.stack || 'undefined'}`;
        console.log('Out2 -> log -> val', val);
        Out.channel.show(true);
        Out.channel.appendLine(val);
    },
};
