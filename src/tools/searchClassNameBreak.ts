import { CAhkClass } from '../AhkSymbol/CAhkClass';
import { pm } from '../core/ProjectManager';

export function searchClassNameBreak(upName: string): CAhkClass | null {
    for (const { AST } of pm.getDocMapValue()) {
        for (const AhkSymbol of AST) {
            if (AhkSymbol instanceof CAhkClass && AhkSymbol.upName === upName) {
                return AhkSymbol;
            }
        }
    }
    return null;
}
