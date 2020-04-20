/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */

import * as vscode from 'vscode';
import { Detecter } from './core/Detecter';

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';
statusBarItem.command = 'ahk.bar.click';

let configs = vscode.workspace.getConfiguration('AhkOutline');
let config = {
    statusBar_showVersion: configs.get('statusBar.showVersion') as boolean,
    statusBar_showTime: configs.get('statusBar.showTime') as boolean,
    statusBar_showFileName: configs.get('statusBar.showFileName') as boolean,
    statusBar_displayColor: configs.get('statusBar.displayColor') as string,
    isAHKv2: configs.get('isAHKv2') as boolean,
    hover_showParm: configs.get('hover.showParm') as boolean,
    hover_showComment: configs.get('hover.showComment') as boolean,
};

export function configChangEvent(): void {
    configs = vscode.workspace.getConfiguration('AhkOutline');
    config = {
        statusBar_showVersion: configs.get('statusBar.showVersion') as boolean,
        statusBar_showTime: configs.get('statusBar.showTime') as boolean,
        statusBar_showFileName: configs.get('statusBar.showFileName') as boolean,
        statusBar_displayColor: configs.get('statusBar.displayColor') as string,
        isAHKv2: configs.get('isAHKv2') as boolean,
        hover_showParm: configs.get('hover.showParm') as boolean,
        hover_showComment: configs.get('hover.showComment') as boolean,
    };
}

export function showTimeSpend(path: string, timeStart: number): void {
    const version = config.statusBar_showVersion ? 'v0.36b1, ' : '';
    const timeSpend = config.statusBar_showTime ? `${Date.now() - timeStart} ms` : '';
    const name = config.statusBar_showFileName
        ? `, ${path.substring(Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\')) + 1, path.length)}`
        : '';
    statusBarItem.text = `$(heart) ${version}${timeSpend}${name}`;
    statusBarItem.color = config.statusBar_displayColor;
    statusBarItem.show();
}
export function getAhkVersion(): boolean {
    return config.isAHKv2;
}
export function getHoverConfig(): { showParm: boolean, showComment: boolean; } {
    const hoverConfig = {
        showParm: config.hover_showParm,
        showComment: config.hover_showComment,
    };
    return hoverConfig;
}
export function statusBarClick() {
    const ahkRootPath = vscode.workspace.rootPath;
    if (ahkRootPath) Detecter.buildByPath(ahkRootPath);
    vscode.window.showInformationMessage('clear docFuncMap cash');
}
// console.log(JSON.stringify(temp));
// vscode.window.setStatusBarMessage(timeSpend);
// ❤♡
