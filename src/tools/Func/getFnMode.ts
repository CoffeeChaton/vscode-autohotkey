import { MyDocSymbol, TDocArr } from '../../globalEnum';
import { EFnMode } from './ahkFucObj';

let wm: WeakMap<MyDocSymbol, EFnMode> = new WeakMap();
let wmSize = 0;
setInterval(() => {
    wm = new WeakMap();
    wmSize = 0;
    console.log('getThisItemOfWm WeakMap clear 10 min');
    // eslint-disable-next-line no-magic-numbers
}, 10 * 60 * 1000); // 10 minute

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
    const maybe = wm.get(docSymbol);
    if (maybe) return maybe;

    const fnMode = getFnMode(docSymbol, DocStrMap);

    // eslint-disable-next-line no-magic-numbers
    if (wmSize > 20000) {
        wm = new WeakMap();
        wmSize = 0;
    }
    wm.set(docSymbol, fnMode);
    wmSize++;

    return fnMode;
}
