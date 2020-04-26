/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */

import * as vscode from 'vscode';
import { Detecter } from './core/Detecter';

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';
statusBarItem.command = 'ahk.bar.click';

let configs = vscode.workspace.getConfiguration('AhkOutline');
let config = {
    statusBar: {
        showVersion: configs.get('statusBar.showVersion') as boolean,
        showTime: configs.get('statusBar.showTime') as boolean,
        showFileName: configs.get('statusBar.showFileName') as boolean,
        displayColor: configs.get('statusBar.displayColor') as string,
    },
    isAHKv2: configs.get('isAHKv2') as boolean,
    hover: {
        showParm: configs.get('hover.showParm') as boolean,
        showComment: configs.get('hover.showComment') as boolean,
    },
};

export function configChangEvent(): void {
    configs = vscode.workspace.getConfiguration('AhkOutline');
    config = {
        statusBar: {
            showVersion: configs.get('statusBar.showVersion') as boolean,
            showTime: configs.get('statusBar.showTime') as boolean,
            showFileName: configs.get('statusBar.showFileName') as boolean,
            displayColor: configs.get('statusBar.displayColor') as string,
        },
        isAHKv2: configs.get('isAHKv2') as boolean,
        hover: {
            showParm: configs.get('hover.showParm') as boolean,
            showComment: configs.get('hover.showComment') as boolean,
        },
    };
}

export function showTimeSpend(uri: vscode.Uri, timeStart: number): void {
    const { fsPath } = uri;//= == '\\server\c$\folder\file.txt'
    const {
        showVersion, showTime, showFileName, displayColor,
    } = config.statusBar;
    const version = showVersion ? 'v0.38, ' : '';
    const timeSpend = showTime ? `${Date.now() - timeStart} ms` : '';
    const name = showFileName
        ? `, ${fsPath.substr(fsPath.lastIndexOf('\\') + 1)}`
        : '';
    statusBarItem.text = `$(heart) ${version}${timeSpend}${name}`;
    statusBarItem.color = displayColor;
    statusBarItem.show();
}
export function getAhkVersion(): boolean {
    return config.isAHKv2;
}
export function getHoverConfig(): { showParm: boolean, showComment: boolean; } {
    return config.hover;
}
export function statusBarClick() {
    const ahkRootPath = vscode.workspace.rootPath;
    if (ahkRootPath) Detecter.buildByPath(ahkRootPath);
    vscode.window.showInformationMessage('clear docFuncMap cash');
}
// console.log(JSON.stringify(temp));
// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
