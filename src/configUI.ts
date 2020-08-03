/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3] }] */
import * as vscode from 'vscode';

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'this extensions by CoffeeChaton/vscode-ahk-outline';
statusBarItem.command = 'ahk.bar.click';

let configs = vscode.workspace.getConfiguration('AhkOutline');
let config = Object.freeze({
    statusBar: {
        showVersion: configs.get('statusBar.showVersion') as boolean,
        showTime: configs.get('statusBar.showTime') as boolean,
        showFileName: configs.get('statusBar.showFileName') as boolean,
        displayColor: configs.get('statusBar.displayColor') as string,
    },
    hover: {
        showParm: configs.get('hover.showParm') as boolean,
        showComment: configs.get('hover.showComment') as boolean,
    },
});

export function configChangEvent(): void {
    configs = vscode.workspace.getConfiguration('AhkOutline');
    config = {
        statusBar: {
            showVersion: configs.get('statusBar.showVersion') as boolean,
            showTime: configs.get('statusBar.showTime') as boolean,
            showFileName: configs.get('statusBar.showFileName') as boolean,
            displayColor: configs.get('statusBar.displayColor') as string,
        },
        hover: {
            showParm: configs.get('hover.showParm') as boolean,
            showComment: configs.get('hover.showComment') as boolean,
        },
    };
}

export function showTimeSpend(uri: vscode.Uri, timeStart: number): void {
    const time = Date.now() - timeStart;
    const fsPathRaw = uri.fsPath;
    const version = config.statusBar.showVersion ? 'v0.4b, ' : '';
    const timeSpend = config.statusBar.showTime ? `${time} ms` : '';
    const name = config.statusBar.showFileName
        ? `, ${fsPathRaw.substr(fsPathRaw.lastIndexOf('\\') + 1)}`
        : '';
    const text = `$(heart) ${version}${timeSpend}${name}`;
    statusBarItem.text = text;
    console.log(`${timeSpend}  ${name}`);
    statusBarItem.color = config.statusBar.displayColor;
    statusBarItem.show();
}

export function getHoverConfig(): { showParm: boolean; showComment: boolean } {
    return config.hover;
}

// console.log(JSON.stringify(temp));
// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
