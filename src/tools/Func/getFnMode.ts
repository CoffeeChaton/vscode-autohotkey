import { MyDocSymbol, TDocArr } from '../../globalEnum';
import { ClassWm } from '../wm';
import { EFnMode } from './ahkFucObj';

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<MyDocSymbol, EFnMode>(10 * 60 * 1000, 'getFnMode', 20000);

// is https://www.autohotkey.com/docs/Functions.htm#Local
function getFnMode(docSymbol: MyDocSymbol, DocStrMap: TDocArr): EFnMode {
    const start = docSymbol.selectionRange.end.line;
    const end = docSymbol.range.end.line;
    for (let i = start; i < end; i++) {
        const lStr = DocStrMap[i].lStr;
        if ((/^\s*local\s*$/i).test(lStr)) return EFnMode.local;
        if ((/^\s*global\s*$/i).test(lStr)) return EFnMode.global;
        if ((/^\s*Static\s*$/i).test(lStr)) return EFnMode.Static;
    }

    return EFnMode.normal;
}

export function getFnModeWM(docSymbol: MyDocSymbol, DocStrMap: TDocArr): EFnMode {
    const maybe = w.getWm(docSymbol);
    if (maybe) return maybe;

    const fnMode = getFnMode(docSymbol, DocStrMap);

    return w.setWm(docSymbol, fnMode);
}
