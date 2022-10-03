import * as vscode from 'vscode';
import type { DeepReadonly } from './globalEnum';
import { OutputChannel } from './provider/vscWindows/OutputChannel';

export const enum ECommandOption {
    All = 0, // "Don't filter Command, Provides all entered commands.",
    Recommended = 1, // "filter not recommended Command. (Referral rules from AhkNekoHelp.)",
    noSameFunc = 2, // "filter Command with the pack has same name function. exp: of ",
    // eslint-disable-next-line no-magic-numbers
    notProvided = 3, // "not provided any Command."
}

type TempConfigs = {
    statusBarDisplayColor: string;
    formatTextReplace: boolean;
    lint: {
        funcSize: number;
    };
    baseScan: {
        IgnoredList: readonly string[];
    };
    snippets: {
        blockFilesList: readonly string[];
        CommandOption: ECommandOption;
    };
    Diag: {
        WarningCap: {
            code500: number; // NeverUsedVar
            code502: number; // of var
            code503: number; // of param
        };
    };
    useCodeLens: boolean;
    useSymbolProvider: boolean;
    // https://code.visualstudio.com/api/references/contribution-points%5C#Configuration-example
};
type TConfigs = DeepReadonly<TempConfigs>;

/*
    ---set start---
*/
export const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
    'ahk-neko-help',
    vscode.StatusBarAlignment.Right,
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
            CommandOption: getConfigs<ECommandOption>('snippets.CommandOption'),
        },
        Diag: {
            WarningCap: {
                code500: getConfigs<number>('Diag.WarningCap.code500'), // NeverUsedVar
                code502: getConfigs<number>('Diag.WarningCap.code502'), // of var
                code503: getConfigs<number>('Diag.WarningCap.code503'), // of param
            },
        },
        useCodeLens: getConfigs<boolean>('useCodeLens'),
        useSymbolProvider: getConfigs<boolean>('useSymbolProvider'),
    } as const;

    statusBarItem.color = ed.statusBarDisplayColor;
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

export function useSymbolProvider(): boolean {
    return config.useSymbolProvider;
}

const wm = new WeakMap<readonly string[], readonly RegExp[]>();

function str2RegexList(strList: readonly string[]): readonly RegExp[] {
    const cache: readonly RegExp[] | undefined = wm.get(strList);
    if (cache !== undefined) return cache;

    // "/\\.",
    // "/node_modules$",
    // "/ahk_lib$",
    // "/ahk_log$",
    // "/ahk_music$",
    // "/IMG$"
    // "/Gdip_.*\\.ahk$",

    let errRuler = '';
    const regexList: RegExp[] = [];
    try {
        for (const str of strList) {
            errRuler = str;
            // eslint-disable-next-line security/detect-non-literal-regexp
            const re = new RegExp(str, 'u');
            regexList.push(re);
        }
    } catch (error: unknown) {
        let message = 'Unknown Error';
        if (error instanceof Error) {
            message = error.message;
        }
        console.error(error);
        OutputChannel.appendLine(';AhkNekoHelp.baseScan.IgnoredList Error Start------------');
        OutputChannel.appendLine(`has error of this ruler: "${errRuler}"`);
        OutputChannel.appendLine(message);
        OutputChannel.appendLine(';AhkNekoHelp.baseScan.IgnoredList Error End--------------');
        OutputChannel.show();
    }

    wm.set(strList, regexList);
    return regexList;
}

export function getIgnoredList(): readonly RegExp[] {
    return str2RegexList(config.baseScan.IgnoredList);
}

export function getSnippetBlockFilesList(): readonly RegExp[] {
    return str2RegexList(config.snippets.blockFilesList);
}

export function getCommandOptions(): ECommandOption {
    return config.snippets.CommandOption;
}
/**
 * NeverUsedVar
 */
export function getCode500Default(): number {
    return config.Diag.WarningCap.code500;
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
