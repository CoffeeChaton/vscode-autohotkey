import { Detecter, TAhkFileData } from '../../core/Detecter';
import { CAhkFuncSymbol, DeepReadonly } from '../../globalEnum';

type TKeyUpName = string;
type TMap = Map<TKeyUpName, CAhkFuncSymbol>;

export type TFullFuncMap = DeepReadonly<TMap>;

export function getAllFunc(): TFullFuncMap {
    const funcMap: TMap = new Map();

    const fsPaths: string[] = Detecter.getDocMapFile();
    for (const fsPath of fsPaths) {
        const AhkFileData: undefined | TAhkFileData = Detecter.getDocMap(fsPath);
        if (AhkFileData === undefined) continue;

        const { AhkSymbolList } = AhkFileData;
        for (const AhkSymbol of AhkSymbolList) {
            if (AhkSymbol instanceof CAhkFuncSymbol) {
                funcMap.set(AhkSymbol.upName, AhkSymbol);
            }
        }
    }
    return funcMap;
}
