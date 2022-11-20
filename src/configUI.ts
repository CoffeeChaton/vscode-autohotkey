import * as vscode from 'vscode';
import type { DeepReadonly } from './globalEnum';
import { OutputChannel } from './provider/vscWindows/OutputChannel';
import { statusBarItem } from './provider/vscWindows/statusBarItem';

export const enum ECommandOption {
    All = 0, // "Don't filter Command, Provides all entered commands.",
    Recommended = 1, // "filter not recommended Command. (Referral rules from AhkNekoHelp.)",
    noSameFunc = 2, // "filter Command with the pack has same name function. exp: of ",
    // eslint-disable-next-line no-magic-numbers
    notProvided = 3, // "not provided any Command."
}

export const enum EDiagMasterSwitch {
    never = 'never',
    auto = 'auto',
    alway = 'alway',
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
        AMasterSwitch: EDiagMasterSwitch;
        code500Max: number; // NeverUsedVar
        code502Max: number; // of var
        code503Max: number; // of param
        code800Deprecated: boolean;
        useModuleValDiag: boolean;
    };
    useCodeLens: boolean;
    useSymbolProvider: boolean;
    // https://code.visualstudio.com/api/references/contribution-points%5C#Configuration-example
};
type TConfigs = DeepReadonly<TempConfigs>;

/*
    ---set start---
*/

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
            AMasterSwitch: getConfigs<EDiagMasterSwitch>('Diag.AMasterSwitch'),
            code500Max: getConfigs<number>('Diag.code500'), // NeverUsedVar
            code502Max: getConfigs<number>('Diag.code502'), // of var
            code503Max: getConfigs<number>('Diag.code503'), // of param
            code800Deprecated: getConfigs<boolean>('Diag.code800Deprecated'), // of param
            useModuleValDiag: getConfigs<boolean>('Diag.useModuleValDiag'),
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

export function getDiagConfig(): TConfigs['Diag'] {
    return config.Diag;
}

export function needDiag(): boolean {
    const { AMasterSwitch } = config.Diag;
    if (
        AMasterSwitch === EDiagMasterSwitch.never
        || (AMasterSwitch === EDiagMasterSwitch.auto && vscode.workspace.workspaceFolders === undefined)
    ) {
        return false;
    }
    return true;
}
// vscode.window.setStatusBarMessage(timeSpend);
// vscode.window.showErrorMessage()
// vscode.window.showInformationMessage()
// ❤♡
