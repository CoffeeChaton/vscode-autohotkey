import * as vscode from 'vscode';
import { TFormatChannel, VERSION } from '../../globalEnum';

export function fmtReplaceWarn(timeStart: number, from: TFormatChannel, fileName: string): void {
    const time = Date.now() - timeStart;
    const message = `${from} ${VERSION.formatRange} "${fileName}", ${time}ms`;
    console.log(message);
    void vscode.window.showInformationMessage(message);
}
