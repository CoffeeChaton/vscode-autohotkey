import { CAhkClass } from '../../CAhkClass';
import { CAhkFunc } from '../../CAhkFunc';
import { TAhkSymbolList } from '../../TAhkSymbolIn';

export function getDAList(AhkSymbolList: TAhkSymbolList): CAhkFunc[] {
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
