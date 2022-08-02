import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { pm } from '../../../core/ProjectManager';

export function getUserDefTopClassSymbol(keyUpName: string): CAhkClass | null {
    for (const { AST: AhkSymbolList } of pm.getDocMapValue()) {
        for (const AhkSymbol of AhkSymbolList) {
            if (
                AhkSymbol instanceof CAhkClass
                && keyUpName === AhkSymbol.upName
            ) {
                return AhkSymbol;
            }
        }
    }
    return null;
}
