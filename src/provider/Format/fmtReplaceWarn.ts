import * as vscode from 'vscode';
import { TFormatChannel, VERSION } from '../../globalEnum';

export function fmtReplaceWarn(timeStart: number, from: TFormatChannel): void {
    const time = Date.now() - timeStart;
    const message = `${from} ${VERSION.formatRange}, ${time}ms`;
    console.log(message);
    vscode.window.showInformationMessage(message);
}
