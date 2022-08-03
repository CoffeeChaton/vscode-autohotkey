import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';
import type { DeepReadonly } from '../../globalEnum';

type TKeyUpName = string;
type TMap = Map<TKeyUpName, CAhkFunc>;

export type TFullFuncMap = DeepReadonly<TMap>;

export function getAllFunc(): TFullFuncMap {
    const funcMap: TMap = new Map();

    for (const { AST } of pm.getDocMapValue()) {
        for (const AhkSymbol of AST) {
            if (AhkSymbol instanceof CAhkFunc) {
                funcMap.set(AhkSymbol.upName, AhkSymbol);
            }
        }
    }
    return funcMap;
}
