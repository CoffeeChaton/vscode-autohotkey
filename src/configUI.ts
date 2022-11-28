import * as vscode from 'vscode';
import type { DeepReadonly } from './globalEnum';
import { statusBarItem } from './provider/vscWindows/statusBarItem';
import { str2RegexListCheck } from './tools/str2RegexListCheck';

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
    baseScan: {
        IgnoredList: readonly string[];
    };
    snippets: {
        blockFilesList: readonly string[];
        CommandOption: ECommandOption;
    };
    Diag: {
        AMasterSwitch: EDiagMasterSwitch;
        code107LegacyAssignment: boolean;
        code300FuncSize: number;
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
        baseScan: {
            IgnoredList: getConfigs<readonly string[]>('baseScan.IgnoredList'),
        },
        snippets: {
            blockFilesList: getConfigs<readonly string[]>('snippets.blockFilesList'),
            CommandOption: getConfigs<ECommandOption>('snippets.CommandOption'),
        },
        Diag: {
            AMasterSwitch: getConfigs<EDiagMasterSwitch>('Diag.AMasterSwitch'),
            code107LegacyAssignment: getConfigs<boolean>('Diag.code107LegacyAssignment'), // of param
            code300FuncSize: getConfigs<number>('Diag.code300FuncSize'),
            code500Max: getConfigs<number>('Diag.code500'), // NeverUsedVar
            code502Max: getConfigs<number>('Diag.code502'), // of var
            code503Max: getConfigs<number>('Diag.code503'), // of param
            code800Deprecated: getConfigs<boolean>('Diag.code800Deprecated'),
            useModuleValDiag: getConfigs<boolean>('Diag.useModuleValDiag'),
        },
        useCodeLens: getConfigs<boolean>('useCodeLens'),
        useSymbolProvider: getConfigs<boolean>('useSymbolProvider'),
    } as const;

    statusBarItem.color = ed.statusBarDisplayColor;
    void str2RegexListCheck(ed.baseScan.IgnoredList);
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
    return str2RegexListCheck(config.baseScan.IgnoredList);
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
