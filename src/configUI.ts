import * as vscode from 'vscode';
import type { ECommandOption, TConfigKey, TConfigs } from './configUI.data';
import { EDiagMasterSwitch } from './configUI.data';
import { statusBarItem } from './provider/vscWindows/statusBarItem';
import { CConfigError } from './tools/DevClass/CConfigError';
import { str2RegexListCheck } from './tools/str2RegexListCheck';

/*
    ---set start---
*/
const enum EStr {
    Config = 'AhkNekoHelp',
}

function getConfigs<T>(Configs: vscode.WorkspaceConfiguration, section: TConfigKey): T {
    const ed: T | undefined = Configs.get<T>(section.replace('AhkNekoHelp.', ''));
    if (ed !== undefined) return ed;
    throw new CConfigError(section);
}

function getConfig(Configs: vscode.WorkspaceConfiguration): TConfigs {
    const ed: TConfigs = {
        Diag: {
            AMasterSwitch: getConfigs<EDiagMasterSwitch>(Configs, 'AhkNekoHelp.Diag.AMasterSwitch'),
            code107: getConfigs<boolean>(Configs, 'AhkNekoHelp.Diag.code107LegacyAssignment'),
            code300fnSize: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code300FuncSize'),
            code500Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code500'), // NeverUsedVar
            code502Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code502'), // of var
            code503Max: getConfigs<number>(Configs, 'AhkNekoHelp.Diag.code503'), // of param
            code800Deprecated: getConfigs<boolean>(Configs, 'AhkNekoHelp.Diag.code800Deprecated'),
            useModuleValDiag: getConfigs<boolean>(Configs, 'AhkNekoHelp.Diag.useModuleValDiag'),
        },
        baseScanIgnoredList: getConfigs<readonly string[]>(Configs, 'AhkNekoHelp.baseScan.IgnoredList'),
        formatTextReplace: getConfigs<boolean>(Configs, 'AhkNekoHelp.format.textReplace'),
        snippets: {
            blockFilesList: getConfigs<readonly string[]>(Configs, 'AhkNekoHelp.snippets.blockFilesList'),
            CommandOption: getConfigs<ECommandOption>(Configs, 'AhkNekoHelp.snippets.CommandOption'),
        },
        statusBarDisplayColor: getConfigs<string>(Configs, 'AhkNekoHelp.statusBar.displayColor'),
        useCodeLens: getConfigs<boolean>(Configs, 'AhkNekoHelp.useCodeLens'),
        useSymbolProvider: getConfigs<boolean>(Configs, 'AhkNekoHelp.useSymbolProvider'),
    } as const;

    statusBarItem.color = ed.statusBarDisplayColor;
    void str2RegexListCheck(ed.baseScanIgnoredList);
    void str2RegexListCheck(ed.snippets.blockFilesList);
    return ed;
}

let config: TConfigs = getConfig(vscode.workspace.getConfiguration(EStr.Config));

export function configChangEvent(): void {
    config = getConfig(vscode.workspace.getConfiguration(EStr.Config));
}

/*
    ---set end---
*/
export function showTimeSpend(showText: string): void {
    statusBarItem.text = `$(heart) ${showText}`;
    statusBarItem.show();
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

export function getIgnoredList(): readonly RegExp[] {
    return str2RegexListCheck(config.baseScanIgnoredList);
}

export function getSnippetBlockFilesList(): readonly RegExp[] {
    return str2RegexListCheck(config.snippets.blockFilesList);
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
