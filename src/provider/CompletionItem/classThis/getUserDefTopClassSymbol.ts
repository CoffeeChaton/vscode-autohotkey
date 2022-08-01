import { CAhkClass } from '../../../AhkSymbol/CAhkClass';
import { Detecter } from '../../../core/Detecter';

export function getUserDefTopClassSymbol(keyUpName: string): CAhkClass | null {
    for (const { AhkSymbolList } of Detecter.getDocMapValue()) {
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
