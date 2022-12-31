import type { contributes } from '../package.json';
import type { DeepReadonly } from './globalEnum';

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
    Diag: {
        AMasterSwitch: EDiagMasterSwitch,
        /**
         * code107LegacyAssignment
         *
         * ```ahk
         * a = this line is string ; diag of "="
         * a := "this line is string"
         * ```
         */
        code107: boolean,
        code300fnSize: number,
        code500Max: number, // NeverUsedVar
        code502Max: number, // of var
        code503Max: number, // of param
        code800Deprecated: boolean,
        useModuleValDiag: boolean,
    },
    baseScanIgnoredList: readonly string[],
    formatTextReplace: boolean,
    snippets: {
        blockFilesList: readonly string[],
        CommandOption: ECommandOption,
    },
    statusBarDisplayColor: string,
    useCodeLens: boolean,
    useSymbolProvider: boolean,
};

/**
 * [Configuration example](https://code.visualstudio.com/api/references/contribution-points%5C#Configuration-example)
 */
export type TConfigs = DeepReadonly<TempConfigs>;

type TConfigJson = typeof contributes.configuration.properties;
type TConfigKey = keyof TConfigJson;

export type TCheckKey<T extends string> = `AhkNekoHelp.${T}` extends TConfigKey ? T : never;
