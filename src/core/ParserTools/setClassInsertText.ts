import { CAhkFunc } from '../../CAhkFunc';
import { TAhkSymbolList } from '../../TAhkSymbolIn';

export function setClassInsertText(children: TAhkSymbolList): '' | string {
    for (const ch of children) {
        if (ch instanceof CAhkFunc && ch.upName === '__NEW') {
            return ch.selectionRangeText.replace(/^__NEW/ui, '');
        }
    }
    return '';
}
