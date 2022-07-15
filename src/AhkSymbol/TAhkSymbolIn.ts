import type { CAhkClass, CAhkClassGetSet, CAhkClassInstanceVar } from './CAhkClass';
import type { CAhkFunc } from './CAhkFunc';
import type { CAhkComment, TLineClass } from './CAhkLine';
import type { CAhkCase, CAhkDefault, CAhkSwitch } from './CAhkSwitch';

export type TAhkSymbol =
    | CAhkCase
    | CAhkClass
    | CAhkClassGetSet
    | CAhkClassInstanceVar
    | CAhkDefault
    | CAhkFunc
    | CAhkSwitch
    | TLineClass;

export type TTopSymbol = CAhkClass | CAhkComment | CAhkFunc | CAhkSwitch | TLineClass;

export type TAhkSymbolList = TAhkSymbol[];
