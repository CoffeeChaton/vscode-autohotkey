/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4,5,10] }] */
import * as mm from 'micromatch';
import * as path from 'path';
import * as vscode from 'vscode';
import { TConfigs } from './globalEnum';
import { checkDebugFile } from './tools/fsTools/file';

/*
    ---set start---
*/
const id = 'ahk-neko-help';
const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(id, vscode.StatusBarAlignment.Left, 0);
statusBarItem.tooltip = 'by CoffeeChaton/vscode-autohotkey-NekoHelp';
statusBarItem.command = 'ahk.bar.click';
let Configs: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('AhkNekoHelp');

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
        baseScan: {
            IgnoredList: Configs.get('baseScan.IgnoredList') as readonly string[],
        },
        Debug: {
            executePath: Configs.get('Debug.executePath') as string,
        },
        snippets: {
            blockFilesList: Configs.get('snippets.blockFilesList') as readonly string[],
        },
        Diag: {
            WarningCap: {
                code502: Configs.get('Diag.WarningCap.code502') as number ?? 3, // of var
                code503: Configs.get('Diag.WarningCap.code503') as number ?? 3, // of param
            },
        },
        openUriStr: Configs.get('open.Documents.Uri') as string,
        // TODO CompletionIgnore
    } as const;

    checkDebugFile(ed.Debug.executePath);
    return ed;
}

let config: TConfigs = getConfig();

export function configChangEvent(): void {
    Configs = vscode.workspace.getConfiguration('AhkNekoHelp');
    config = getConfig();
}
/*
    ---set end---
*/

export function showTimeSpend(fsPath: string, time: number): void {
    statusBarItem.text = `$(heart) ${time} ms of ${path.basename(fsPath)}`;
    statusBarItem.color = config.statusBar.displayColor;
    statusBarItem.show();
}

export function getLintConfig(): { funcSize: number } {
    return config.lint;
}

export function getFormatConfig(): boolean {
    return config.format.textReplace;
}

export function getIgnored(fsPath: string): boolean {
    const blockList = config.baseScan.IgnoredList;
    return mm.isMatch(fsPath, blockList);
}

export function getDebugPath(): string {
    return config.Debug.executePath;
}

export function getSnippetBlockFilesList(): readonly string[] {
    return config.snippets.blockFilesList;
}

/**
 * of var.
 */
export function getCode502Default(): number {
    return config.Diag.WarningCap.code502;
}

/**
 * of param.
 */
export function getCode503Default(): number {
    return config.Diag.WarningCap.code503;
}

export function getDocUriStr(): string {
    return config.openUriStr;
}

// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
