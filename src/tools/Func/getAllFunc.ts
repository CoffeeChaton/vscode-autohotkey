import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { Detecter } from '../../core/Detecter';
import type { DeepReadonly } from '../../globalEnum';

type TKeyUpName = string;
type TMap = Map<TKeyUpName, CAhkFunc>;

export type TFullFuncMap = DeepReadonly<TMap>;

export function getAllFunc(): TFullFuncMap {
    const funcMap: TMap = new Map();

    for (const { AhkSymbolList } of Detecter.getDocMapValue()) {
        for (const AhkSymbol of AhkSymbolList) {
            if (AhkSymbol instanceof CAhkFunc) {
                funcMap.set(AhkSymbol.upName, AhkSymbol);
            }
        }
    }
    return funcMap;
}
