import { globalValMap } from './globalValMap';

type TFsPath = string;
export function getGlobalValDef(valUpName: string): null | TFsPath {
    for (const [fsPath, TGValMap] of globalValMap) {
        const c = TGValMap.has(valUpName);
        if (c) return fsPath;
    }
    return null;
}
