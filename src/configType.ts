import { DeepReadonly } from './globalEnum';

type TempConfigs = {
    statusBar: {
        displayColor: string;
    };
    format: {
        textReplace: boolean;
    };
    lint: {
        funcSize: number;
    };
    baseScan: {
        IgnoredList: readonly string[];
    };
    snippets: {
        blockFilesList: readonly string[];
    };
    Diag: {
        WarningCap: {
            code502: number; // of var
            code503: number; // of param
        };
    };
    openUriStr: string; //
};
export type TConfigs = DeepReadonly<TempConfigs>;
