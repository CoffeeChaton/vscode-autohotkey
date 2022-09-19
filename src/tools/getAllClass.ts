import { CAhkClass } from '../AhkSymbol/CAhkClass';
import { pm } from '../core/ProjectManager';

export type TAllClassMap = ReadonlyMap<string, CAhkClass>;

export function getAllClass(): TAllClassMap {
    const classMap = new Map<string, CAhkClass>();

    for (const { AST } of pm.getDocMapValue()) {
        for (const AhkSymbol of AST) {
            if (AhkSymbol instanceof CAhkClass) {
                classMap.set(AhkSymbol.upName, AhkSymbol);
            }
        }
    }
    return classMap;
}
