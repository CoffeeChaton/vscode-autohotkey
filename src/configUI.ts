/* eslint no-magic-numbers: ["error", { "ignore": [0,1,2,3,4,5,10] }] */
import * as vscode from 'vscode';
import { TConfigs } from './configType';

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
statusBarItem.command = 'ahk.nekoHelp.bar';

const Config = 'AhkNekoHelp';
let Configs: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(Config);

function getConfigs<T>(section: string): T {
    const ed: T | undefined = Configs.get<T>(section);
    if (ed !== undefined) return ed;
    throw new Error(`${section}, not found err code--40--11--33-- at configUI.ts`);
}

function getConfig(): TConfigs {
    const ed: TConfigs = {
        statusBarDisplayColor: getConfigs<string>('statusBar.displayColor'),
        formatTextReplace: getConfigs<boolean>('format.textReplace'),
        lint: {
            funcSize: getConfigs<number>('lint.funcSize'),
        },
        baseScan: {
            IgnoredList: getConfigs<readonly string[]>('baseScan.IgnoredList'),
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
        useCodeLens: getConfigs<boolean>('useCodeLens'),
    } as const;

    return ed;
}

let config: TConfigs = getConfig();

export function configChangEvent(): void {
    Configs = vscode.workspace.getConfiguration(Config);
    config = getConfig();
}

/*
    ---set end---
*/

export function showTimeSpend(showText: string): void {
    statusBarItem.text = `$(heart) ${showText}`;
    statusBarItem.color = config.statusBarDisplayColor;
    statusBarItem.show();
}

export function getLintConfig(): { funcSize: number } {
    return config.lint;
}

export function getCodeLenConfig(): boolean {
    return config.useCodeLens;
}

export function getFormatConfig(): boolean {
    return config.formatTextReplace;
}

const wm: WeakMap<readonly string[], readonly RegExp[]> = new WeakMap();

function str2RegexList(key: readonly string[]): readonly RegExp[] {
    const cache: readonly RegExp[] | undefined = wm.get(key);
    if (cache !== undefined) return cache;

    // "/\\.",
    // "/node_modules$",
    // "/ahk_lib$",
    // "/ahk_log$",
    // "/ahk_music$",
    // "/IMG$"
    // "/Gdip_.*\\.ahk$",

    // eslint-disable-next-line security/detect-non-literal-regexp
    const regexList: readonly RegExp[] = key.map((str: string): RegExp => new RegExp(str, 'u'));

    wm.set(key, regexList);
    return regexList;
}

export function getIgnoredList(): readonly RegExp[] {
    const key: readonly string[] = config.baseScan.IgnoredList;
    return str2RegexList(key);
}

export function getSnippetBlockFilesList(): readonly RegExp[] {
    const key: readonly string[] = config.snippets.blockFilesList;
    return str2RegexList(key);
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

// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
