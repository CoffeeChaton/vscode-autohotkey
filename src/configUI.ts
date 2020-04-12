/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */

import * as vscode from 'vscode';

const versionValue = 'v0.33, ';
const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';
let configuration = vscode.workspace.getConfiguration('AhkOutline.statusBar');
let configs = [
    configuration.get('showVersion') as boolean,
    configuration.get('showTime') as boolean,
    configuration.get('showFileName') as boolean,
    configuration.get('displayColor') as string,
];
let version = configs[0] ? versionValue : '';
let color = configs[3];

export function configChangEvent(): void {
    configuration = vscode.workspace.getConfiguration('AhkOutline.statusBar');
    configs = [
        configuration.get('showVersion') as boolean,
        configuration.get('showTime') as boolean,
        configuration.get('showFileName') as boolean,
        configuration.get('displayColor') as string,
    ];
    version = configs[0] ? versionValue : '';
    [, , , color] = configs;
}

export function showTimeSpend(path: string, timeStart: number): void {
    const timeSpend = configs[1] ? `${Date.now() - timeStart} ms` : '';
    const name = configs[2]
        ? `, ${path.substring(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1, path.length)}`
        : '';
    statusBarItem.text = `$(ruby) ${version}${timeSpend}${name}`;
    statusBarItem.command = 'ahk.bar.click';
    statusBarItem.color = color;
    statusBarItem.show();
}
export function statusBarClick() {
    vscode.window.showWarningMessage('ahk.bar.click');
}
// console.log(timeSpend);
// vscode.window.setStatusBarMessage(timeSpend);
