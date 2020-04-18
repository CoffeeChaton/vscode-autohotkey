/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */

import * as vscode from 'vscode';


const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';
statusBarItem.command = 'ahk.bar.click';

let configuration = vscode.workspace.getConfiguration('AhkOutline.statusBar');
let config = {
    showVersion: configuration.get('showVersion') as boolean,
    showTime: configuration.get('showTime') as boolean,
    showFileName: configuration.get('showFileName') as boolean,
    displayColor: configuration.get('displayColor') as string,
};

export function configChangEvent(): void {
    configuration = vscode.workspace.getConfiguration('AhkOutline.statusBar');
    config = {
        showVersion: configuration.get('showVersion') as boolean,
        showTime: configuration.get('showTime') as boolean,
        showFileName: configuration.get('showFileName') as boolean,
        displayColor: configuration.get('displayColor') as string,
    };
}

export function showTimeSpend(path: string, timeStart: number): void {
    const version = config.showVersion ? 'v0.35, ' : '';
    const timeSpend = config.showTime ? `${Date.now() - timeStart} ms` : '';
    const name = config.showFileName
        ? `, ${path.substring(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1, path.length)}`
        : '';
    statusBarItem.text = `$(heart) ${version}${timeSpend}${name}`;
    statusBarItem.color = config.displayColor;
    statusBarItem.show();
}

export function statusBarClick() {
    vscode.window.showWarningMessage('ahk.bar.click');
}
// console.log(timeSpend);
// vscode.window.setStatusBarMessage(timeSpend);
