/* eslint-disable no-magic-numbers */
import { EFnMode, TAhkSymbol, TTokenStream } from '../../globalEnum';
import { ClassWm } from '../wm';
import { kindPick } from './kindPick';

// is https://www.autohotkey.com/docs/Functions.htm#Local
function getFnMode(ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): EFnMode {
    const startLine = ahkSymbol.range.start.line;
    const endLine = ahkSymbol.range.end.line;
    for (const { lStr, line } of DocStrMap) {
        if (line <= startLine) continue;
        if (line > endLine) break;
        if ((/^\s*local\s*$/i).test(lStr)) return EFnMode.local;
        if ((/^\s*global\s*$/i).test(lStr)) return EFnMode.global;
        if ((/^\s*Static\s*$/i).test(lStr)) return EFnMode.Static;
    }

    return EFnMode.normal;
}

const w = new ClassWm<TAhkSymbol, EFnMode>(10 * 60 * 1000, 'getFnMode', 20000);

export function getFnModeWM(ahkSymbol: TAhkSymbol, DocStrMap: TTokenStream): EFnMode {
    if (!kindPick(ahkSymbol.kind)) throw new Error(`kind Error of getFnModeWM of ${ahkSymbol.name}--35--11--66`);

    const cache = w.getWm(ahkSymbol);
    if (cache) return cache;

    const fnMode = getFnMode(ahkSymbol, DocStrMap);

    return w.setWm(ahkSymbol, fnMode);
}
