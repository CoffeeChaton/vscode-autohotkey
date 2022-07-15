import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkFileData } from '../../core/Detecter';
import { Detecter } from '../../core/Detecter';
import type { DeepReadonly } from '../../globalEnum';

type TKeyUpName = string;
type TMap = Map<TKeyUpName, CAhkFunc>;

export type TFullFuncMap = DeepReadonly<TMap>;

export function getAllFunc(): TFullFuncMap {
    const funcMap: TMap = new Map();

    const fsPaths: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkFileData: TAhkFileData | undefined = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { AhkSymbolList } = AhkFileData;
        for (const AhkSymbol of AhkSymbolList) {
            if (AhkSymbol instanceof CAhkFunc) {
                funcMap.set(AhkSymbol.upName, AhkSymbol);
            }
        }
    }
    return funcMap;
}
