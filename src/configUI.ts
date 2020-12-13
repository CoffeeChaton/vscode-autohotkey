import * as vscode from 'vscode';
import { VERSION } from './globalEnum';

const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'by CoffeeChaton/vscode-autohotkey-NekoHelp';
statusBarItem.command = 'ahk.bar.click';
let Configs = vscode.workspace.getConfiguration('AhkNekoHelp');
type TConfigs = {
    statusBar: {
        showVersion: boolean;
        showTime: boolean;
        showFileName: boolean;
        displayColor: string;
    };
    hover: {
        showComment: boolean;
    };
    format: {
        textReplace: boolean;
    };
    lint: {
        funcSize: number;
    };
};
function getConfig(): TConfigs {
    return {
        statusBar: {
            showVersion: Configs.get('statusBar.showVersion') as boolean,
            showTime: Configs.get('statusBar.showTime') as boolean,
            showFileName: Configs.get('statusBar.showFileName') as boolean,
            displayColor: Configs.get('statusBar.displayColor') as string,
        },
        hover: {
            showComment: Configs.get('hover.showComment') as boolean,
        },
        format: {
            textReplace: Configs.get('format.textReplace') as boolean,
        },
        lint: {
            funcSize: Configs.get('lint.funcSize') as number,
        },
    };
}

let config = getConfig();

export function configChangEvent(): void {
    Configs = vscode.workspace.getConfiguration('AhkNekoHelp');
    config = getConfig();
}

export function showTimeSpend(uri: vscode.Uri, timeStart: number): void {
    const time = Date.now() - timeStart;
    const fsPathRaw = uri.fsPath;
    const version = config.statusBar.showVersion ? VERSION.Parser : '';
    const timeSpend = config.statusBar.showTime ? `${time} ms` : '';
    const name = config.statusBar.showFileName
        ? ` of ${fsPathRaw.substring(fsPathRaw.lastIndexOf('\\') + 1)}`
        : '';
    statusBarItem.text = `$(heart) ${version}${timeSpend}${name}`;
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
