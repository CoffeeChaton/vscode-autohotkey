/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */

import * as vscode from 'vscode';
import { Detecter } from './core/Detecter';

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';
statusBarItem.command = 'ahk.bar.click';

let configs = vscode.workspace.getConfiguration('AhkOutline.statusBar');
let config = {
    showVersion: configs.get('showVersion') as boolean,
    showTime: configs.get('showTime') as boolean,
    showFileName: configs.get('showFileName') as boolean,
    displayColor: configs.get('displayColor') as string,
};
let isAHKv2 = vscode.workspace.getConfiguration('AhkOutline').get('isAHKv2') as boolean;
let hoverConfig = {
    ShowParm: vscode.workspace.getConfiguration('AhkOutline.Hover').get('ShowParm') as boolean,
    ShowComment: vscode.workspace.getConfiguration('AhkOutline.Hover').get('ShowComment') as boolean,
};

export function configChangEvent(): void {
    configs = vscode.workspace.getConfiguration('AhkOutline.statusBar');
    config = {
        showVersion: configs.get('showVersion') as boolean,
        showTime: configs.get('showTime') as boolean,
        showFileName: configs.get('showFileName') as boolean,
        displayColor: configs.get('displayColor') as string,
    };
    isAHKv2 = vscode.workspace.getConfiguration('AhkOutline').get('isAHKv2') as boolean;
    hoverConfig = {
        ShowParm: vscode.workspace.getConfiguration('AhkOutline.Hover').get('ShowParm') as boolean,
        ShowComment: vscode.workspace.getConfiguration('AhkOutline.Hover').get('ShowComment') as boolean,
    };
}

export function showTimeSpend(path: string, timeStart: number): void {
    const version = config.showVersion ? 'v0.36, ' : '';
    const timeSpend = config.showTime ? `${Date.now() - timeStart} ms` : '';
    const name = config.showFileName
        ? `, ${path.substring(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1, path.length)}`
        : '';
    statusBarItem.text = `$(heart) ${version}${timeSpend}${name}`;
    statusBarItem.color = config.displayColor;
    statusBarItem.show();
}
export function getAhkVersion(): boolean {
    return isAHKv2;
}
export function getHoverShow(): { ShowParm: boolean, ShowComment: boolean; } {
    return hoverConfig;
}
export function statusBarClick() {
    const ahkRootPath = vscode.workspace.rootPath;
    if (ahkRootPath) Detecter.buildByPath(ahkRootPath);
    vscode.window.showInformationMessage('clear docFuncMap cash');
}
// console.log(JSON.stringify(temp));
// vscode.window.setStatusBarMessage(timeSpend);
