import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import { Detecter } from '../../core/Detecter';

export function getFuncWithName(wordUP: string): CAhkFunc | null {
    for (const { AhkSymbolList } of Detecter.getDocMapValue()) {
        for (const DA of AhkSymbolList) {
            if (DA instanceof CAhkFunc && DA.upName === wordUP) {
                return DA;
            }
        }
    }
    return null;
}
