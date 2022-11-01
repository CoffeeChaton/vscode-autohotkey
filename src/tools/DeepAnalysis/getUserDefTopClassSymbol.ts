import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { pm } from '../../core/ProjectManager';

export function getUserDefTopClassSymbol(keyUpName: string): CAhkClass | null {
    for (const { AST } of pm.getDocMapValue()) {
        for (const AhkSymbol of AST) {
            if (AhkSymbol instanceof CAhkClass && keyUpName === AhkSymbol.upName) {
                return AhkSymbol;
            }
        }
    }
    return null;
}
