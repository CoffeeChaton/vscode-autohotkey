import * as vscode from 'vscode';
import { VERSION } from './globalEnum';

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'by CoffeeChaton/vscode-autohotkey-NekoHelp';
statusBarItem.command = 'ahk.bar.click';

let configs = vscode.workspace.getConfiguration('AhkNekoHelp');
let config = {
    statusBar: {
        showVersion: configs.get('statusBar.showVersion') as boolean,
        showTime: configs.get('statusBar.showTime') as boolean,
        showFileName: configs.get('statusBar.showFileName') as boolean,
        displayColor: configs.get('statusBar.displayColor') as string,
    },
    hover: {
        showComment: configs.get('hover.showComment') as boolean,
    },
    format: {
        textReplace: configs.get('format.textReplace') as boolean,
    },
    lint: {
        funcSize: configs.get('lint.funcSize') as number,
    },
};

export function configChangEvent(): void {
    configs = vscode.workspace.getConfiguration('AhkNekoHelp');
    config = {
        statusBar: {
            showVersion: configs.get('statusBar.showVersion') as boolean,
            showTime: configs.get('statusBar.showTime') as boolean,
            showFileName: configs.get('statusBar.showFileName') as boolean,
            displayColor: configs.get('statusBar.displayColor') as string,
        },
        hover: {
            showComment: configs.get('hover.showComment') as boolean,
        },
        format: {
            textReplace: configs.get('format.textReplace') as boolean,
        },
        lint: {
            funcSize: configs.get('lint.funcSize') as number,
        },
    };
}

export function showTimeSpend(uri: vscode.Uri, timeStart: number): void {
    const time = Date.now() - timeStart;
    const fsPathRaw = uri.fsPath;
    const version = config.statusBar.showVersion ? VERSION.Parser : '';
    const timeSpend = config.statusBar.showTime ? `${time} ms` : '';
    const name = config.statusBar.showFileName
        ? ` of ${fsPathRaw.substring(fsPathRaw.lastIndexOf('\\') + 1)}`
        : '';
    const text = `$(heart) ${version}${timeSpend}${name}`;
    statusBarItem.text = text;
    console.log(time, ` ms of ${fsPathRaw.substring(fsPathRaw.lastIndexOf('\\') + 1)}`);
    statusBarItem.color = config.statusBar.displayColor;
    statusBarItem.show();
}

export function getHoverConfig(): { showComment: boolean } {
    return config.hover;
}
export function getLintConfig(): { funcSize: number; } {
    return config.lint;
}
export function getFormatConfig(): boolean {
    return config.format.textReplace;
}
// console.log(JSON.stringify(val));
// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
