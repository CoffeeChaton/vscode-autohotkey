import * as vscode from 'vscode';
import { EVersion } from '../../Enum/EVersion';
import { EFormatChannel } from '../../globalEnum';

export function fmtReplaceWarn(timeStart: number, from: EFormatChannel, fileName: string): void {
    const time = Date.now() - timeStart;
    const message = `${from} ${EVersion.formatRange} "${fileName}", ${time}ms`;
    console.log(message);
    void vscode.window.showInformationMessage(message);
}
