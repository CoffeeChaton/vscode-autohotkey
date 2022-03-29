/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4,5,10] }] */
import * as mm from 'micromatch';
import * as vscode from 'vscode';
import { TConfigs } from './globalEnum';
import { checkDebugFile } from './tools/fsTools/file';

/*
    ---set start---
*/
const id = 'ahk-neko-help';
export const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    id,
    vscode.StatusBarAlignment.Right,
    0,
);
statusBarItem.tooltip = 'by CoffeeChaton/vscode-autohotkey-NekoHelp';
statusBarItem.command = 'ahk.bar.click';
let Configs: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('AhkNekoHelp');

function getConfigs<T>(section: string): T {
    const ed: T | undefined = Configs.get<T>(section);
    if (ed !== undefined) return ed;
    throw new Error(`${section}, not found err code--40--11--33-- at configUI.ts`);
}

function getConfig(): TConfigs {
    const ed: TConfigs = {
        statusBar: {
            displayColor: getConfigs<string>('statusBar.displayColor'),
        },
        format: {
            textReplace: getConfigs<boolean>('format.textReplace'),
        },
        lint: {
            funcSize: getConfigs<number>('lint.funcSize'),
        },
        baseScan: {
            IgnoredList: getConfigs<readonly string[]>('baseScan.IgnoredList'),
        },
        Debug: {
            executePath: getConfigs<string>('Debug.executePath'),
        },
        snippets: {
            blockFilesList: getConfigs<readonly string[]>('snippets.blockFilesList'),
        },
        Diag: {
            WarningCap: {
                code502: getConfigs<number>('Diag.WarningCap.code502'), // of var
                code503: getConfigs<number>('Diag.WarningCap.code503'), // of param
            },
        },
        openUriStr: getConfigs<string>('open.Documents.Uri'),
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

export function showTimeSpend(showText: string, time: number): void {
    statusBarItem.text = `$(heart) ${time} ms of ${showText}`;
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
