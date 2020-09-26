// import * as fs from 'fs';
import * as vscode from 'vscode';

// export class Out {
//     private static channel: vscode.OutputChannel;

//     public static log(value: NodeJS.ErrnoException): void {
//         if (!this.channel) {
//             this.channel = vscode.window.createOutputChannel('AHK');
//         }
//         this.channel.show(true);
//         this.channel.appendLine(`${value.stack || 'undefined'} at Out.ts line--12--167`);
//     }
// }

export const Out = {
    channel: vscode.window.createOutputChannel('AHK'),
    log(value: NodeJS.ErrnoException): void {
        const val = `readdir err at Out.ts line--19--167, ${value.stack || 'undefined'}`;
        console.log('Out2 -> log -> val', val);
        Out.channel.show(true);
        Out.channel.appendLine(val);
    },
};
