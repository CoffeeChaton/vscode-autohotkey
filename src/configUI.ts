/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */

import * as vscode from 'vscode';

interface IConfigs {
    showVersion: boolean;
    showTime: boolean
    showFileName: boolean
    displayColor: string
}

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';
statusBarItem.command = 'ahk.bar.click';

let configuration = vscode.workspace.getConfiguration('AhkOutline.statusBar');
let configs: IConfigs = {
    showVersion: configuration.get('showVersion') as boolean,
    showTime: configuration.get('showTime') as boolean,
    showFileName: configuration.get('showFileName') as boolean,
    displayColor: configuration.get('displayColor') as string,
};

export function configChangEvent(): void {
    configuration = vscode.workspace.getConfiguration('AhkOutline.statusBar');
    configs = {
        showVersion: configuration.get('showVersion') as boolean,
        showTime: configuration.get('showTime') as boolean,
        showFileName: configuration.get('showFileName') as boolean,
        displayColor: configuration.get('displayColor') as string,
    };
}

export function showTimeSpend(path: string, timeStart: number): void {
    const version = configs.showVersion ? 'v0.34, ' : '';
    const timeSpend = configs.showTime ? `${Date.now() - timeStart} ms` : '';
    const name = configs.showFileName
        ? `, ${path.substring(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1, path.length)}`
        : '';
    statusBarItem.text = `$(ruby) ${version}${timeSpend}${name}`;
    statusBarItem.color = configs.displayColor;
    statusBarItem.show();
}

export function statusBarClick() {
    vscode.window.showWarningMessage('ahk.bar.click');
}
// console.log(timeSpend);
// vscode.window.setStatusBarMessage(timeSpend);
