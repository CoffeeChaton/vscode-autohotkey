import * as vscode from 'vscode';
import type { ECommandOption, TCheckKey, TConfigs } from './configUI.data';
import { EDiagMasterSwitch } from './configUI.data';
import { statusBarItem } from './provider/vscWindows/statusBarItem';
import { CConfigError } from './tools/DevClass/CConfigError';
import { str2RegexListCheck } from './tools/str2RegexListCheck';

/*
    ---set start---
*/
const Config = 'AhkNekoHelp';
let Configs: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration(Config);

// WTF
function getConfigs<T, V extends string>(section: TCheckKey<V>): T {
    const ed: T | undefined = Configs.get<T>(section);
    if (ed !== undefined) return ed;
    throw new CConfigError(section);
}

function getConfig(): TConfigs {
    const ed: TConfigs = {
        Diag: {
            AMasterSwitch: getConfigs<EDiagMasterSwitch, 'Diag.AMasterSwitch'>('Diag.AMasterSwitch'),
            code107: getConfigs<boolean, 'Diag.code107LegacyAssignment'>('Diag.code107LegacyAssignment'),
            code300fnSize: getConfigs<number, 'Diag.code300FuncSize'>('Diag.code300FuncSize'),
            code500Max: getConfigs<number, 'Diag.code500'>('Diag.code500'), // NeverUsedVar
            code502Max: getConfigs<number, 'Diag.code502'>('Diag.code502'), // of var
            code503Max: getConfigs<number, 'Diag.code503'>('Diag.code503'), // of param
            code800Deprecated: getConfigs<boolean, 'Diag.code800Deprecated'>('Diag.code800Deprecated'),
            useModuleValDiag: getConfigs<boolean, 'Diag.useModuleValDiag'>('Diag.useModuleValDiag'),
        },
        baseScanIgnoredList: getConfigs<readonly string[], 'baseScan.IgnoredList'>('baseScan.IgnoredList'),
        formatTextReplace: getConfigs<boolean, 'format.textReplace'>('format.textReplace'),
        snippets: {
            blockFilesList: getConfigs<readonly string[], 'snippets.blockFilesList'>('snippets.blockFilesList'),
            CommandOption: getConfigs<ECommandOption, 'snippets.CommandOption'>('snippets.CommandOption'),
        },
        statusBarDisplayColor: getConfigs<string, 'statusBar.displayColor'>('statusBar.displayColor'),
        useCodeLens: getConfigs<boolean, 'useCodeLens'>('useCodeLens'),
        useSymbolProvider: getConfigs<boolean, 'useSymbolProvider'>('useSymbolProvider'),
    } as const;

    statusBarItem.color = ed.statusBarDisplayColor;
    void str2RegexListCheck(ed.baseScanIgnoredList);
    void str2RegexListCheck(ed.snippets.blockFilesList);
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
