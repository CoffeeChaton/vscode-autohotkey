import { DeepReadonly } from './globalEnum';

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
    };
    Diag: {
        WarningCap: {
            code502: number; // of var
            code503: number; // of param
        };
    };
    openUriStr: string; //
    useCodeLens: boolean;
};
export type TConfigs = DeepReadonly<TempConfigs>;
