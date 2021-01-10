import { TAhkSymbol, EFnMode, TTokenStream } from '../../globalEnum';
import { ClassWm } from '../wm';
import { kindPick } from './kindPick';

// eslint-disable-next-line no-magic-numbers
const w = new ClassWm<TAhkSymbol, EFnMode>(10 * 60 * 1000, 'getFnMode', 20000);

// is https://www.autohotkey.com/docs/Functions.htm#Local
function getFnMode(ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): EFnMode {
    const startLine = ahkSymbol.range.start.line;
    const endLine = ahkSymbol.range.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line < startLine) continue;
        if (line > endLine) break;
        if ((/^\s*local\s*$/i).test(lStr)) return EFnMode.local;
        if ((/^\s*global\s*$/i).test(lStr)) return EFnMode.global;
        if ((/^\s*Static\s*$/i).test(lStr)) return EFnMode.Static;
    }

    return EFnMode.normal;
}

export function getFnModeWM(ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): EFnMode {
    if (!kindPick(ahkSymbol.kind)) throw new Error(`kind Error of getFnModeWM of ${ahkSymbol.name}`);

    const cache = w.getWm(ahkSymbol);
    if (cache) return cache;

    const fnMode = getFnMode(ahkSymbol, DocStrMap);

    return w.setWm(ahkSymbol, fnMode);
}
