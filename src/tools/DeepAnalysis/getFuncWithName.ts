import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { pm } from '../../core/ProjectManager';

export function getFuncWithName(wordUP: string): CAhkFunc | null {
    for (const { AST } of pm.getDocMapValue()) {
        for (const DA of AST) {
            if (DA instanceof CAhkFunc && DA.upName === wordUP) {
                return DA;
            }
        }
    }
    return null;
}
