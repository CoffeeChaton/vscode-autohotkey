import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';

export type TFullFuncMap = ReadonlyMap<string, CAhkFunc>;

export function getAllFunc(): TFullFuncMap {
    const funcMap = new Map<string, CAhkFunc>();

    for (const { AST } of pm.getDocMapValue()) {
        for (const AhkSymbol of AST) {
            if (AhkSymbol instanceof CAhkFunc) {
                funcMap.set(AhkSymbol.upName, AhkSymbol);
            }
        }
    }
    return funcMap;
}
