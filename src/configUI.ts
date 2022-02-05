/* eslint-disable immutable/no-mutation */
import * as fs from 'fs';
import * as path from 'path';

import * as vscode from 'vscode';
import { TConfigs } from './globalEnum';
/*
    ---set start---
*/
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'by CoffeeChaton/vscode-autohotkey-NekoHelp';
statusBarItem.command = 'ahk.bar.click';
let Configs = vscode.workspace.getConfiguration('AhkNekoHelp');

function getConfig(): TConfigs {
    const ed: TConfigs = {
        statusBar: {
            displayColor: Configs.get('statusBar.displayColor') as string,
        },
        format: {
            textReplace: Configs.get('format.textReplace') as boolean,
        },
        lint: {
            funcSize: Configs.get('lint.funcSize') as number,
        },
        Ignored: {
            folder: {
                startsWith: Configs.get('Ignored.folder.startsWith') as string[],
                endsWith: Configs.get('Ignored.folder.endsWith') as string[],
            },
            File: {
                startsWith: Configs.get('Ignored.File.startsWith') as string[],
                endsWith: Configs.get('Ignored.File.endsWith') as string[],
            },
        },
        Debug: {
            executePath: Configs.get('Debug.executePath') as string,
        },
    } as const;
    const { executePath } = ed.Debug;

    fs.access(executePath, (err: NodeJS.ErrnoException | null): void => {
        if (err) {
            const errCode = err.message ? ` <---> err.message ${err.message}` : '';
            const msg = `setting err of "AhkNekoHelp.Debug.executePath" : "${executePath}"${errCode}`;
            console.log('fs.access ~ msg', msg);
            vscode.window.showErrorMessage(msg);
            const msg2 = `can't find the file at "${executePath}"`;
            vscode.window.showErrorMessage(msg2);
        }
    });
    return ed;
}

let config = getConfig();

export function configChangEvent(): void {
    Configs = vscode.workspace.getConfiguration('AhkNekoHelp');
    config = getConfig();
}
/*
    ---set end---
*/

export function showTimeSpend(uri: vscode.Uri, timeStart: number): void {
    const time = Date.now() - timeStart;
    statusBarItem.text = `$(heart) ${time} ms of${path.basename(uri.fsPath)}`;
    statusBarItem.color = config.statusBar.displayColor;
    statusBarItem.show();
}

export function getLintConfig(): { funcSize: number; } {
    return config.lint;
}

export function getFormatConfig(): boolean {
    return config.format.textReplace;
}

export function getIgnoredFolder(file: string): boolean {
    const { startsWith } = config.Ignored.folder;
    for (const e of startsWith) {
        if (file.startsWith(e)) return true;
    }
    const { endsWith } = config.Ignored.folder;
    for (const e of endsWith) {
        if (file.endsWith(e)) return true;
    }
    return false;
}

export function getIgnoredFile(buildPath: string): boolean {
    const fileFix = path.basename(buildPath, '.ahk');
    const { startsWith } = config.Ignored.File;
    for (const e of startsWith) {
        if (fileFix.startsWith(e)) return true;
    }
    const { endsWith } = config.Ignored.File;
    for (const e of endsWith) {
        if (fileFix.endsWith(e)) return true;
    }
    return false;
}
export function getDebugPath(): string {
    return config.Debug.executePath;
}
// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
