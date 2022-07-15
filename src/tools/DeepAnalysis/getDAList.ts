import { CAhkClass } from '../../AhkSymbol/CAhkClass';
import { CAhkFunc } from '../../AhkSymbol/CAhkFunc';
import type { TAhkSymbolList } from '../../AhkSymbol/TAhkSymbolIn';

export function getDAList(AhkSymbolList: Readonly<TAhkSymbolList>): CAhkFunc[] {
    const result: CAhkFunc[] = [];
    for (const DA of AhkSymbolList) {
        if (DA instanceof CAhkFunc) {
            result.push(DA);
        } else if (DA instanceof CAhkClass) {
            result.push(...getDAList(DA.children));
        }
    }
    return result;
}
