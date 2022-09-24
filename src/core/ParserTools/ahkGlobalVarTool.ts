import { pm } from '../ProjectManager';

type TData = {
    fsPathList: string[];
    rawName: string;
    // and any you want to has Data
};

export type TGlobalVarUpNameMap = ReadonlyMap<string, TData>;

export function getGlobalUpNameMap(): TGlobalVarUpNameMap {
    const map = new Map<string, TData>();

    for (const { GValMap, uri } of pm.getDocMapValue()) {
        for (const [k, { rawName }] of GValMap) {
            const oldData: TData | undefined = map.get(k);
            const fsPathList: string[] = oldData !== undefined
                ? [...oldData.fsPathList, uri.toString()]
                : [uri.toString()];

            map.set(k, {
                fsPathList,
                rawName,
            });
        }
        //
    }

    return map;
}
